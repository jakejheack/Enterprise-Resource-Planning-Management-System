using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;
namespace ezinvmvc.App.Stocks.DTO
{
   public class StockCardOutput : FullAuditedEntity<int>
    {
        public int TransactionTypeId { get; set; }

        public int TransactionId { get; set; }

        public int TransactionItemId { get; set; }

        public string TransactionCode { get; set; }

        public DateTime TransactionTime { get; set; }

        public int ProductId { get; set; }

        public decimal Qty { get; set; }

        public int UnitId { get; set; }

        public int WarehouseId { get; set; } //Warehouse

        [NotMapped]
        public string TransactionType { get; set; }

        [NotMapped]
        public string ProductCode { get; set; }

        [NotMapped]
        public string ProductName { get; set; }

        [NotMapped]
        public string ProductCategory { get; set; }

        [NotMapped]
        public string ProductBrand { get; set; }

        [NotMapped]
        public string Unit { get; set; }

        [NotMapped]
        public string Warehouse { get; set; }

        [NotMapped]
        public decimal Balance { get; set; }

        [NotMapped]
        public string TransactionName { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
