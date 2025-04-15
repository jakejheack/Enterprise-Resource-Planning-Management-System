using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ezinvmvc.App.Sales.DTO
{
   public class SalesInvoiceItemOutput : FullAuditedEntity<int>
    {
        public int SalesInvoiceId { get; set; }
        
        public int IndexNo { get; set; }

        public int ProductId { get; set; }

        public string Description { get; set; }

        public decimal OrderQty { get; set; }

        public int UnitId { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal Disc1 { get; set; }

        public int DiscType1 { get; set; }

        public decimal Disc2 { get; set; }

        public int DiscType2 { get; set; }

        public decimal Disc3 { get; set; }

        public int DiscType3 { get; set; }

        public decimal DiscTotal { get; set; }

        public decimal Total { get; set; }

        public int ExpenseAccountId { get; set; }

        public int InventoryAccountId { get; set; }

        public int IncomeAccountId { get; set; }

        [NotMapped]
        public string ProductCode { get; set; }

        [NotMapped]
        public string ProductName { get; set; }

        [NotMapped]
        public string Unit { get; set; }

        [NotMapped]
        public string ImageName { get; set; }

        public string Color { get; set; }
    }
}
