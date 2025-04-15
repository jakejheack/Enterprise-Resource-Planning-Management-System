using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface IUnitManager : IDomainService
    {
        Task<IEnumerable<Unit>> GetAllList();
        Task<Unit> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Unit entity);
        Task<IdentityResult> UpdateAsync(Unit entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
