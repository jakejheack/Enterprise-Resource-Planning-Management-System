using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.RequestForPayment.Dto
{
    public class RFPItemOutput : FullAuditedEntity<int>
    {
        [Required]
        public int RequestId { get; set; }

        //[Required]
        public int ProductId { get; set; }

        //[Required]
        public string ProductName { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Qty { get; set; }

        //[Required]
        public int UnitId { get; set; }

        //[Required]
        public decimal UnitPrice { get; set; }

        //[Required]
        public decimal Disc1 { get; set; }

        //[Required]
        public int DiscType1 { get; set; }

        //[Required]
        public decimal Disc2 { get; set; }

        //[Required]
        public int DiscType2 { get; set; }

        //[Required]
        public decimal Disc3 { get; set; }

        //[Required]
        public int DiscType3 { get; set; }

        //[Required]
        public decimal DiscTotal { get; set; }

        //[Required]
        public decimal Total { get; set; }

        public string GroupName { get; set; }

        public int InventoryAccountId { get; set; }

        [NotMapped]
        public string RequestCode { get; set; }

        [NotMapped]
        public string ProductCode { get; set; }

        [NotMapped]
        public string Unit { get; set; }
    }
}
