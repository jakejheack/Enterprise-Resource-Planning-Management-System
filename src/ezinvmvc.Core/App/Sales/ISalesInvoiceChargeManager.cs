using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
  public  interface ISalesInvoiceChargeManager : IDomainService
    {
        Task<IEnumerable<SalesInvoiceCharge>> GetAllByParentId(int parentid);
        Task<SalesInvoiceCharge> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(SalesInvoiceCharge entity);
        Task<IdentityResult> UpdateAsync(SalesInvoiceCharge entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
