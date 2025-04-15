using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Stocks
{
   [Table("AppStockCard")]
   public class StockCard : FullAuditedEntity<int>
    {
        [Required]
        public int TransactionTypeId { get; set; }

        [Required]
        public int TransactionId { get; set; }

        [Required]
        public int TransactionItemId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string TransactionCode { get; set; }

        [Required]
        public DateTime TransactionTime { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public decimal Qty { get; set; }

        [Required]
        public int UnitId { get; set; }

        [Required]
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
