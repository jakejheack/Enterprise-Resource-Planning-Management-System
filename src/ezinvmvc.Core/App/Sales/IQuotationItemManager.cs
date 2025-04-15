using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
   public interface IQuotationItemManager : IDomainService
    {
        Task<IEnumerable<QuotationItem>> GetAllByParentId(int parentid);
        Task<QuotationItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(QuotationItem entity);
        Task<IdentityResult> UpdateAsync(QuotationItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
