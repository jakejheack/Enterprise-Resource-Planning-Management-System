using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
   public interface IPricingTypeManager : IDomainService
    {
        Task<IEnumerable<PricingType>> GetAllList();
        Task<PricingType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(PricingType entity);
        Task<IdentityResult> UpdateAsync(PricingType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
