using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
using ezinvmvc.App.Notification.Models;
using ezinvmvc.App.Employees;

namespace ezinvmvc.App.Notification
{
    public interface IUserNotificationManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(UserNotification entity);

        Task<IEnumerable<UserNotification>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);

        Task<UserNotification> GetByIdAsync(int id);

        Task<IdentityResult> UpdateAsync(UserNotification entity);

        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<UserNotification>> GetAll();

        Task<IEnumerable<UserNotification>> MarkAllRead(int id);

        Task<IEnumerable<Employee>> GetUsersByPermissionList(string filter, string sorting);
    }
}
