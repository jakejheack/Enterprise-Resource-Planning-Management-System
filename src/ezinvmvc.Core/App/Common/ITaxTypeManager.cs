using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
   public interface ITaxTypeManager: IDomainService
    {
        Task<IEnumerable<TaxType>> GetAllList();
        Task<TaxType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(TaxType entity);
        Task<IdentityResult> UpdateAsync(TaxType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
