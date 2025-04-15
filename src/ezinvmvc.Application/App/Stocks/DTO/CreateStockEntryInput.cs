using System.Collections.Generic;

namespace ezinvmvc.App.Stocks.DTO
{
    public class CreateStockEntryInput
    {
        public StockEntryInput stockentry { get; set; }
        public List<StockEntryItemInput> stockentryitem { get; set; }
    }
}
