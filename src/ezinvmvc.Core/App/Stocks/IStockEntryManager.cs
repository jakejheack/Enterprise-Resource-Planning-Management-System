using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Stocks
{
   public interface IStockEntryManager : IDomainService
    {
        Task<IEnumerable<StockEntry>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<StockEntry> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(StockEntry entity);
        Task<IdentityResult> UpdateAsync(StockEntry entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
