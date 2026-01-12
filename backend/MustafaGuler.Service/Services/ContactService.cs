using AutoMapper;
using MustafaGuler.Core.DTOs.Contact;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Service.Services
{
    public class ContactService : IContactService
    {
        private readonly IGenericRepository<ContactMessage> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;
        private readonly IMapper _mapper;

        public ContactService(
            IGenericRepository<ContactMessage> repository,
            IUnitOfWork unitOfWork,
            IMailService mailService,
            IMapper mapper)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mailService = mailService;
            _mapper = mapper;
        }

        public async Task<Result> SubmitContactFormAsync(CreateContactMessageDto dto, string? clientIp)
        {
            var contactMessage = new ContactMessage
            {
                SenderName = dto.Name,
                SenderEmail = dto.Email,
                Subject = dto.Subject,
                MessageBody = dto.Message,
                AllowPromo = dto.AllowPromo,
                ClientIp = clientIp,
                IsMailSent = false,
                IsReplied = false
            };

            await _repository.AddAsync(contactMessage);
            await _unitOfWork.CommitAsync();

            var mailSent = await _mailService.SendContactEmailAsync(contactMessage);

            if (mailSent)
            {
                contactMessage.IsMailSent = true;
                _repository.Update(contactMessage);
                await _unitOfWork.CommitAsync();
            }

            return Result.Success(201, "Your message has been received. Thank you for contacting us!");
        }

        public async Task<PagedResult<ContactMessageListDto>> GetPagedListAsync(PaginationParams paginationParams)
        {
            var pagedEntities = await _repository.GetPagedListAsync(
                paginationParams,
                filter: x => !x.IsDeleted,
                orderBy: q => q.OrderByDescending(x => x.CreatedDate)
            );

            var dtoList = _mapper.Map<List<ContactMessageListDto>>(pagedEntities.Data);
            return new PagedResult<ContactMessageListDto>(dtoList, pagedEntities.TotalCount, pagedEntities.PageNumber, pagedEntities.PageSize);
        }

        public async Task<Result<ContactMessageDetailDto>> GetByIdAsync(Guid id)
        {
            var message = await _repository.GetByIdAsync(id);

            if (message == null || message.IsDeleted)
            {
                return Result<ContactMessageDetailDto>.Failure(404, "Contact message not found.");
            }

            var dto = _mapper.Map<ContactMessageDetailDto>(message);
            return Result<ContactMessageDetailDto>.Success(dto);
        }

        public async Task<Result<IEnumerable<SubscriberDto>>> GetSubscribersAsync()
        {
            var subscribers = await _repository.GetAllAsync(
                filter: x => x.AllowPromo && !x.IsDeleted
            );

            var distinctSubscribers = subscribers
                .GroupBy(x => x.SenderEmail)
                .Select(g => g.First());

            var dtoList = _mapper.Map<IEnumerable<SubscriberDto>>(distinctSubscribers);
            return Result<IEnumerable<SubscriberDto>>.Success(dtoList);
        }
    }
}
