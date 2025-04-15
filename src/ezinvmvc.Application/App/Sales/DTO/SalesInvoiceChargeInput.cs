using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
   public class SalesInvoiceChargeInput : FullAuditedEntity<int>
    {
        [Required]
        public int SalesInvoiceId { get; set; }

        [Required]
        public int RevenueAccountId { get; set; }

        [Required]
        public int ChargeTypeId { get; set; }

        [Required]
        public decimal Rate { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public decimal Total { get; set; }

        //MULTIPLE INVOICE
        [Required]
        public decimal BillTotal { get; set; }
        [NotMapped]
        public decimal BilledTotal { get; set; }
        [NotMapped]
        public decimal Balance { get; set; }

        [NotMapped]
        public string ChargeType { get; set; }
    }
}
