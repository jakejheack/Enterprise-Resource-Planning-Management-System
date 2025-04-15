using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales
{
    [Table("AppDeliveryReceiptItem")]
    public class DeliveryReceiptItem : FullAuditedEntity<int>
    {
        [Required]
        public int DeliveryReceiptId { get; set; }

        [Required]
        public int IndexNo { get; set; }

        [Required]
        public int SalesOrderItemId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght3072, ErrorMessage = ezinvmvcConsts.ErrorMessage3072)]
        public string Description { get; set; }

        [Required]
        public decimal Qty { get; set; }
        
        public decimal? DeliveredQty { get; set; }

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

        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string GroupName { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Reference { get; set; }

        public string Color { get; set; }

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
