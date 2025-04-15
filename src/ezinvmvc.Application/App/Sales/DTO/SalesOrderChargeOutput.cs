using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public class SalesOrderChargeOutput : FullAuditedEntity<int>
    {
        public int SalesOrderId { get; set; }

        public int ChargeTypeId { get; set; }

        public decimal Rate { get; set; }

        public decimal Amount { get; set; }

        public decimal Total { get; set; }

        [NotMapped]
        public int RevenueAccountId { get; set; }

        [NotMapped]
        public string ChargeType { get; set; }

        [NotMapped]
        public int DeliveryRate { get; set; }

        [NotMapped]
        public decimal BillTotal { get; set; }
        [NotMapped]
        public decimal Balance { get; set; }
    }
}
