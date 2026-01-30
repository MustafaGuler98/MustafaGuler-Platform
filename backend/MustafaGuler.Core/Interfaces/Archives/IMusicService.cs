using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.DTOs.LastFm;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IMusicService : IArchiveMediaService<MusicDto, CreateMusicDto, UpdateMusicDto>
    {
        Task<Result<Guid?>> SyncBatchAsync(List<LastFmTrackDto> tracks);
    }
}
