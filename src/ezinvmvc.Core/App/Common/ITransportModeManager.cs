using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
   public interface ITransportModeManager : IDomainService
    {
        Task<IEnumerable<TransportMode>> GetAllList();
        Task<TransportMode> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(TransportMode entity);
        Task<IdentityResult> UpdateAsync(TransportMode entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
