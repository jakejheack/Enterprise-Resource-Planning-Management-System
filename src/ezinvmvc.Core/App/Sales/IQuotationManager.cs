using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
   public interface IQuotationManager : IDomainService
    {
        Task<IEnumerable<Quotation>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Quotation>> GetAllRevisionList(string filter, string sorting);
        Task<Quotation> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Quotation entity);
        Task<IdentityResult> UpdateAsync(Quotation entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
