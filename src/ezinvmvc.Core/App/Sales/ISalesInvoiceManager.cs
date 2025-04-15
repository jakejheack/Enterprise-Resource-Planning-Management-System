using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ezinvmvc.App.Sales
{
    public interface ISalesInvoiceManager:IDomainService
    {
        Task<IEnumerable<SalesInvoice>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<SalesInvoice> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(SalesInvoice entity);
        Task<IdentityResult> UpdateAsync(SalesInvoice entity);
        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<vAccountsReceivable>> GetAR(string filter, string sorting, int offset, int fetch, bool forexport);
    }
}
