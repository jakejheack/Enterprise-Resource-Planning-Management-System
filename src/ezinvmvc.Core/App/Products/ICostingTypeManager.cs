using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface ICostingTypeManager: IDomainService
    {
        Task<IEnumerable<CostingType>> GetAllList();
        Task<CostingType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(CostingType entity);
        Task<IdentityResult> UpdateAsync(CostingType entity);
        Task<IdentityResult> DeleteAsync(int id);

    }
}
