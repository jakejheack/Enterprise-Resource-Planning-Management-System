using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales
{
    [Table("AppSalesInvoiceItem")]
    public class SalesInvoiceItem : FullAuditedEntity<int>
    {
        [Required]
        public int SalesInvoiceId { get; set; }

        [Required]
        public int IndexNo { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght3072, ErrorMessage = ezinvmvcConsts.ErrorMessage3072)]
        public string Description { get; set; }

        [Required]
        public decimal OrderQty { get; set; }

        [Required]
        public int UnitId { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }

        [Required]
        public decimal Disc1 { get; set; }

        [Required]
        public int DiscType1 { get; set; }

        [Required]
        public decimal Disc2 { get; set; }

        [Required]
        public int DiscType2 { get; set; }

        [Required]
        public decimal Disc3 { get; set; }

        [Required]
        public int DiscType3 { get; set; }

        [Required]
        public decimal DiscTotal { get; set; }

        [Required]
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
