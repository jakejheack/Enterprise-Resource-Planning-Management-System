using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
   public class DeliveryReceiptChargeOutput : FullAuditedEntity<int>
    {
        public int DeliveryReceiptId { get; set; }

        public int SalesOrderChargeId { get; set; }

        public int ChargeTypeId { get; set; }

        public decimal Rate { get; set; }

        public decimal Amount { get; set; }

        public decimal Total { get; set; }

        [NotMapped]
        public string ChargeType { get; set; }
    }
}
