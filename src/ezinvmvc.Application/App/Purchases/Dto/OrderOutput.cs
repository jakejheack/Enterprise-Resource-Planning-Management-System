using System;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Purchases.Dto
{
    public class OrderOutput : FullAuditedEntity<int>
    {
        public int VendorId { get; set; }

        public int WarehouseId { get; set; }

        public DateTime TransactionTime { get; set; }

        public string Status { get; set; }

        public string ReferenceNo { get; set; }

        public int Term { get; set; }

        public string Note { get; set; }

        public decimal Shipping { get; set; }

        public decimal TotalAmount { get; set; }

        [NotMapped]
        public string Vendor { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
