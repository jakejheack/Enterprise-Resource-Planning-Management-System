using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public  class QuotationChargeInput : FullAuditedEntity<int>
    {
        [Required]
        public int QuotationId { get; set; }

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
