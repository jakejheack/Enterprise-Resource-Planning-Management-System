using System;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Purchases.Dto
{
    public class OrderInput : FullAuditedEntity<int>
    {
        public int VendorId { get; set; }

        public int WarehouseId { get; set; }

        [Required]
        public DateTime TransactionTime { get; set; }

        [Required]
        public string Status { get; set; }

        public string ReferenceNo { get; set; }

        [Required]
        public int Term { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        public string Note { get; set; }

        public decimal Shipping { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
