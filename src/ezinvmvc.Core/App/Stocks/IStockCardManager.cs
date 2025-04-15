using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Stocks
{
  public interface IStockCardManager : IDomainService
    {
        Task<IEnumerable<StockSummary>> GetAllSummary(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<StockCard>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<StockCard>> GetAllByParentId(int parentid);
        Task<StockCard> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(StockCard entity);
        Task<IdentityResult> UpdateAsync(StockCard entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
