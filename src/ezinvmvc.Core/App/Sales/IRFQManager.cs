using Abp.Domain.Services;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public interface IRFQManager : IDomainService
    {
        Task<IEnumerable<RFQ>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<RFQ>> GetAllRevisionList(string filter, string sorting);
        Task<IEnumerable<RFQ>> GetAllListforQuotation(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<RFQ> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(RFQ entity);
        Task<IdentityResult> UpdateAsync(RFQ entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
