using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace ezinvmvc.App.Sales
{
   public interface ISalesInvoiceItemManager : IDomainService
    {
        Task<IEnumerable<SalesInvoiceItem>> GetAllByParentId(int parentid);
        Task<SalesInvoiceItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(SalesInvoiceItem entity);
        Task<IdentityResult> UpdateAsync(SalesInvoiceItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
