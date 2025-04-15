using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Stocks.DTO
{
   public class StockEntryItemOutput : FullAuditedEntity<int>
    {
        public int StockEntryId { get; set; }
        
        public int IndexNo { get; set; }

        public int ProductId { get; set; }

        public string Description { get; set; }

        public decimal QtyRel { get; set; }

        public decimal Qty { get; set; }

        public int UnitId { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal Total { get; set; }

        [NotMapped]
        public string ProductCode { get; set; }

        [NotMapped]
        public string ProductName { get; set; }

        [NotMapped]
        public string ProductDescription { get; set; }

        [NotMapped]
        public string Unit { get; set; }

        [NotMapped]
        public string ImageName { get; set; }
    }
}
