using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
using ezinvmvc.App.Notification.Models;

namespace ezinvmvc.App.Notification
{
    public interface INotificationManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(Models.Notification entity);

        Task<IEnumerable<Models.Notification>> GetAllList(string filter, string sorting);

        Task<Models.Notification> GetByIdAsync(int id);

        Task<IdentityResult> UpdateAsync(Models.Notification entity);

        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<Models.Notification>> GetAll();
    }
}
