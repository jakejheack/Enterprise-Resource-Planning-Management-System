using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
   public class QuotationChargeOutput : FullAuditedEntity<int>
    {
        public int QuotationId { get; set; }

        public int ChargeTypeId { get; set; }

        public decimal Rate { get; set; }

        public decimal Amount { get; set; }

        public decimal Total { get; set; }

        [NotMapped]
        public string ChargeType { get; set; }
    }
}
