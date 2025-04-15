using System.Collections.Generic;

namespace ezinvmvc.App.Stocks.DTO
{
   public class UpdateStockEntryInput
    {
        public StockEntryInput stockentry { get; set; }
        public List<StockEntryItemInput> stockentryitem { get; set; }
    }
}
