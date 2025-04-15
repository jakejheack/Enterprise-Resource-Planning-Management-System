using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Clients
{
    public interface IIndustryManager : IDomainService
    {
        Task<IEnumerable<Industry>> GetAllList();
        Task<Industry> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Industry entity);
        Task<IdentityResult> UpdateAsync(Industry entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
