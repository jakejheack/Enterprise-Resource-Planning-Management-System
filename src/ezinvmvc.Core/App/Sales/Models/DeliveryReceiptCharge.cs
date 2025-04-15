using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales
{
    [Table("AppDeliveryReceiptCharge")]
    public class DeliveryReceiptCharge : FullAuditedEntity<int>
    {
        [Required]
        public int DeliveryReceiptId { get; set; }

        [Required]
        public int SalesOrderChargeId { get; set; }

        [Required]
        public int ChargeTypeId { get; set; }

        [Required]
        public decimal Rate { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public decimal Total { get; set; }

        [NotMapped]
        public string ChargeType { get; set; }
    }
}
