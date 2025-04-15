using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Stocks.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Stocks
{
    public interface IStockEntryService : IApplicationService
    {
        Task<int> CreateStockEntry(CreateStockEntryInput input);
        Task<PagedResultDto<StockEntryOutput>> GetStockEntries(GetStockEntriesInput input);
        Task<GetStockEntryOutput> GetStockEntry(GetStockEntryInput input);
        Task<int> UpdateStockEntry(UpdateStockEntryInput input);

        Task<PagedResultDto<StockEntryItemOutput>> GetStockEntryItemByParentId(GetStockEntryInput input);
        Task<PagedResultDto<StockCardOutput>> GetStockCards(GetStockEntriesInput input);
        Task<PagedResultDto<StockSummaryOutput>> GetStockSummary(GetStockEntriesInput input);
    }
}
