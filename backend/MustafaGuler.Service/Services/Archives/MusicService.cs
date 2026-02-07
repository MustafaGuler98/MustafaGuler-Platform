using AutoMapper;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.DTOs.LastFm;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class MusicService : BaseMediaService<Music, MusicDto, CreateMusicDto, UpdateMusicDto>, IMusicService
    {
        private readonly IImageService _imageService;
        private readonly Microsoft.Extensions.Logging.ILogger<MusicService> _logger;

        public MusicService(
            IGenericRepository<Music> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IImageService imageService,
            Microsoft.Extensions.Logging.ILogger<MusicService> logger,
            ICacheInvalidationService cacheInvalidation) : base(repository, unitOfWork, mapper, cacheInvalidation)
        {
            _imageService = imageService;
            _logger = logger;
        }

        protected override string GetEntityName() => "Music";
        protected override string GetDuplicateMessage() => "A song with this title and artist already exists";

        protected override async Task<bool> CheckDuplicateAsync(CreateMusicDto dto)
        {
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.Artist == dto.Artist && !x.IsDeleted);
        }

        protected override async Task<bool> CheckDuplicateOnUpdateAsync(Music entity, UpdateMusicDto dto)
        {
            if (entity.Title == dto.Title && entity.Artist == dto.Artist) return false;
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.Artist == dto.Artist && x.Id != entity.Id && !x.IsDeleted);
        }

        public async Task<Result<Guid?>> SyncBatchAsync(List<LastFmTrackDto> tracks)
        {
            if (tracks == null || tracks.Count == 0)
                return Result<Guid?>.Success(null);

            try
            {
                var validTracks = tracks
                    .Where(t => t.Attributes?.NowPlaying != "true" && !string.IsNullOrEmpty(t.Name) && !string.IsNullOrEmpty(t.Artist?.Text))
                    .ToList();

                if (validTracks.Count == 0)
                    return Result<Guid?>.Success(null);

                var trackInfos = validTracks
                    .Select(t => new { Title = t.Name, Artist = t.Artist.Text })
                    .Distinct()
                    .ToList();

                var titles = trackInfos.Select(t => t.Title).ToHashSet();

                // Batch Database Query
                var existingMusicList = await _repository.GetAllAsync(m => titles.Contains(m.Title) && !m.IsDeleted);

                var existingMusicDict = existingMusicList
                    .GroupBy(m => new { m.Title, m.Artist })
                    .ToDictionary(g => g.Key, g => g.First());

                var newMusicEntities = new List<Music>();
                bool hasUpdates = false;
                Guid? mostRecentMusicId = null;

                foreach (var track in validTracks)
                {
                    string title = track.Name;
                    string artist = track.Artist.Text;
                    var lookupKey = new { Title = title, Artist = artist };

                    if (existingMusicDict.TryGetValue(lookupKey, out var existingMusic))
                    {
                        // Check if we need to update timestamp
                        DateTime trackDate = DateTime.UtcNow;
                        if (track.Date != null && long.TryParse(track.Date.Uts, out var uts))
                        {
                            trackDate = DateTimeOffset.FromUnixTimeSeconds(uts).UtcDateTime;
                        }

                        if (existingMusic.UpdatedDate == null || trackDate > existingMusic.UpdatedDate)
                        {
                            var trackedMusic = await _repository.GetByIdAsync(existingMusic.Id);
                            if (trackedMusic != null)
                            {
                                trackedMusic.UpdatedDate = trackDate;
                                hasUpdates = true;
                            }
                        }

                        if (!mostRecentMusicId.HasValue) mostRecentMusicId = existingMusic.Id;
                    }
                    else
                    {
                        var pendingMusic = newMusicEntities.FirstOrDefault(m => m.Title == title && m.Artist == artist);
                        if (pendingMusic != null)
                        {
                            if (!mostRecentMusicId.HasValue) mostRecentMusicId = pendingMusic.Id; // Note: This ID is temporary/empty here, catch 22.
                        }
                        else
                        {
                            // Create New
                            string album = track.Album?.Text ?? "";
                            string imgUrl = track.Images?.LastOrDefault()?.Url ?? "";

                            DateTime createdDate = DateTime.UtcNow;
                            if (track.Date != null && long.TryParse(track.Date.Uts, out var uts))
                            {
                                createdDate = DateTimeOffset.FromUnixTimeSeconds(uts).UtcDateTime;
                            }

                            var newMusic = new Music
                            {
                                Id = Guid.NewGuid(),
                                Title = title,
                                Artist = artist,
                                Album = album,
                                CreatedDate = createdDate,
                                IsDeleted = false,
                                MyRating = 0
                            };

                            if (!string.IsNullOrEmpty(imgUrl))
                            {
                                var dlResult = await _imageService.DownloadAndUploadAsync(imgUrl, "archives/music");
                                if (dlResult.IsSuccess) newMusic.CoverImageUrl = dlResult.Data;
                            }

                            newMusicEntities.Add(newMusic);
                            if (!mostRecentMusicId.HasValue) mostRecentMusicId = newMusic.Id;
                        }
                    }
                }

                if (newMusicEntities.Count > 0)
                {
                    await _repository.AddRangeAsync(newMusicEntities);
                    await _unitOfWork.CommitAsync();
                }
                else if (hasUpdates)
                {
                    await _unitOfWork.CommitAsync();
                }

                return Result<Guid?>.Success(mostRecentMusicId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing music batch");
                return Result<Guid?>.Failure(500, ex.Message);
            }
        }
    }
}
