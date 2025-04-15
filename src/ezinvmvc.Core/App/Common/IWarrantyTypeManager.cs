using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
   public interface IWarrantyTypeManager: IDomainService
    {
        Task<IEnumerable<WarrantyType>> GetAllList();
        Task<WarrantyType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(WarrantyType entity);
        Task<IdentityResult> UpdateAsync(WarrantyType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
