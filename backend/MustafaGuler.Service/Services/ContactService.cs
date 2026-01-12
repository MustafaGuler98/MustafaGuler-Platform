using MustafaGuler.Core.DTOs.Contact;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Service.Services
{
    public class ContactService : IContactService
    {
        private readonly IGenericRepository<ContactMessage> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;

        public ContactService(
            IGenericRepository<ContactMessage> repository,
            IUnitOfWork unitOfWork,
            IMailService mailService)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mailService = mailService;
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
    }
}
