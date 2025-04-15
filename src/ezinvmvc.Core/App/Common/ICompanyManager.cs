using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface ICompanyManager: IDomainService
    {
        Task<IEnumerable<Company>> GetAllList();
        Task<Company> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Company entity);
        Task<IdentityResult> UpdateAsync(Company entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
