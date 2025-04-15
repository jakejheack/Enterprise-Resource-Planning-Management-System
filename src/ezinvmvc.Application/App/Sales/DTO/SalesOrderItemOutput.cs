using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public class SalesOrderItemOutput : FullAuditedEntity<int>
    {
        public int SalesOrderId { get; set; }
        
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

        public string Reference { get; set; }

        public string Color { get; set; }

        [NotMapped]
        public int ExpenseAccountId { get; set; }

        [NotMapped]
        public int InventoryAccountId { get; set; }

        [NotMapped]
        public int IncomeAccountId { get; set; }

        [NotMapped]
        public string ProductCode { get; set; }

        [NotMapped]
        public string ProductName { get; set; }

        [NotMapped]
        public string Unit { get; set; }

        [NotMapped]
        public int DeliveryQty { get; set; }

        [NotMapped]
        public int ReturnQty { get; set; }

        [NotMapped]
        public string ImageName { get; set; }
    }
}
