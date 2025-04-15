using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Stocks
{
   public interface IStockEntryItemManager : IDomainService
    {
        Task<IEnumerable<StockEntryItem>> GetAllByParentId(int parentid);
        Task<StockEntryItem> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(StockEntryItem entity);
        Task<IdentityResult> UpdateAsync(StockEntryItem entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
