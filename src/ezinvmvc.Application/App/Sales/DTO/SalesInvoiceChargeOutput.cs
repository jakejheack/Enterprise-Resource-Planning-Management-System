using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public class SalesInvoiceChargeOutput : FullAuditedEntity<int>
    {
        public int SalesInvoiceId { get; set; }

        public int RevenueAccountId { get; set; }

        public int ChargeTypeId { get; set; }

        public decimal Rate { get; set; }

        public decimal Amount { get; set; }

        public decimal Total { get; set; }

        //MULTIPLE INVOICE
        public decimal BillTotal { get; set; }
        [NotMapped]
        public decimal BilledTotal { get; set; }
        [NotMapped]
        public decimal Balance { get; set; }

        [NotMapped]
        public string ChargeType { get; set; }
    }
}
