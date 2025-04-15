using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
  public  class SalesOrderChargeInput : FullAuditedEntity<int>
    {
        [Required]
        public int SalesOrderId { get; set; }

        [Required]
        public int ChargeTypeId { get; set; }

        [Required]
        public decimal Rate { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
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
