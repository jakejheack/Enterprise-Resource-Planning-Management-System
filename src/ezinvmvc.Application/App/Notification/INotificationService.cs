using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Notification.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Notification
{
    public interface INotificationService : IApplicationService
    {
        Task CreateNotification(CreateNotificationInput input);
        Task<PagedResultDto<GetNotificationOutput>> GetNotifications(GetNotificationsInput input);
        Task<GetNotificationOutput> GetNotification(GetNotificationInput input);
        Task<GetNotificationOutput> UpdateNotification(UpdateNotificationInput input);
    }
}
