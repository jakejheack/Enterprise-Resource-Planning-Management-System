using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
   public interface IQuotationChargeManager : IDomainService
    {
        Task<IEnumerable<QuotationCharge>> GetAllByParentId(int parentid);
        Task<QuotationCharge> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(QuotationCharge entity);
        Task<IdentityResult> UpdateAsync(QuotationCharge entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
