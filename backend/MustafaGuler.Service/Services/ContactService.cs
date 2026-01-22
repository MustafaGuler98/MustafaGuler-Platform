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
        private readonly IGenericRepository<Subscriber> _subscriberRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;
        private readonly IMapper _mapper;

        public ContactService(
            IGenericRepository<ContactMessage> repository,
            IGenericRepository<Subscriber> subscriberRepository,
            IUnitOfWork unitOfWork,
            IMailService mailService,
            IMapper mapper)
        {
            _repository = repository;
            _subscriberRepository = subscriberRepository; // Correctly assigned
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

            if (dto.AllowPromo)
            {
                var existingSubscriber = await _subscriberRepository.GetAsync(x => x.Email == dto.Email);
                if (existingSubscriber == null)
                {
                    await _subscriberRepository.AddAsync(new Subscriber
                    {
                        Email = dto.Email,
                        Source = "ContactForm",
                        IsActive = true
                    });
                }
                else if (!existingSubscriber.IsActive)
                {
                    existingSubscriber.IsActive = true;
                    _subscriberRepository.Update(existingSubscriber);
                }
            }

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

        public async Task<Result<PagedResult<ContactMessageListDto>>> GetPagedListAsync(PaginationParams paginationParams)
        {
            var pagedEntities = await _repository.GetPagedListAsync(
                paginationParams,
                filter: x => !x.IsDeleted,
                orderBy: q => q.OrderByDescending(x => x.CreatedDate)
            );

            var dtoList = _mapper.Map<List<ContactMessageListDto>>(pagedEntities.Items);
            var pagedResult = new PagedResult<ContactMessageListDto>(dtoList, pagedEntities.TotalCount, pagedEntities.PageNumber, pagedEntities.PageSize);
            return Result<PagedResult<ContactMessageListDto>>.Success(pagedResult);
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

        public async Task<Result<PagedResult<SubscriberDto>>> GetSubscribersAsync(PaginationParams paginationParams)
        {
            var pagedEntities = await _subscriberRepository.GetPagedListAsync(
                paginationParams,
                filter: x => x.IsActive && !x.IsDeleted,
                orderBy: q => q.OrderByDescending(x => x.CreatedDate)
            );

            var dtoList = _mapper.Map<List<SubscriberDto>>(pagedEntities.Items);
            var pagedResult = new PagedResult<SubscriberDto>(dtoList, pagedEntities.TotalCount, pagedEntities.PageNumber, pagedEntities.PageSize);
            return Result<PagedResult<SubscriberDto>>.Success(pagedResult);
        }
    }
}
