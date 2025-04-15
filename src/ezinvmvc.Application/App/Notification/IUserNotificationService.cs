using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Notification.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Notification
{
    public interface IUserNotificationService : IApplicationService
    {
        Task CreateUserNotification(CreateUserNotificationInput input);
        Task<PagedResultDto<GetUserNotificationOutput>> GetUserNotifications(GetUserNotificationsInput input);
        Task<GetUserNotificationOutput> GetUserNotification(GetUserNotificationInput input);
        Task<PagedResultDto<GetUserNotificationOutput>> MarkAllRead(GetUserNotificationInput input);
        Task<GetUserNotificationOutput> UpdateUserNotification(UpdateUserNotificationInput input);
        Task<IEnumerable<GetEmployeeOutput>> GetUsersByPermission(GetUserNotificationsInput input);
    }
}
