
namespace ezinvmvc.App.Stocks.DTO
{
   public class StockSummaryOutput
    {
        public int ProductId { get; set; }

        public decimal Qty { get; set; }

        public int UnitId { get; set; }

        public int WarehouseId { get; set; }

        public string ProductCode { get; set; }

        public string ProductName { get; set; }

        public string ProductCategory { get; set; }

        public string ProductBrand { get; set; }

        public string Description { get; set; }
        
        public string AlertLevel { get; set; }

        public string Unit { get; set; }

        public string Warehouse { get; set; }

        public int TotalRows { get; set; }
    }
}
