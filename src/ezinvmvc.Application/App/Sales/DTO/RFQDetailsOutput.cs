using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.Dto
{
   public  class RFQDetailsOutput : FullAuditedEntity<int>
    {
        public int RFQId { get; set; }

        public int IndexNo { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public string Description { get; set; }

        public string Color { get; set; }

        public int ItemType { get; set; }

        public int Qty { get; set; }
        
        public int UnitId { get; set; }
        
        public decimal UnitPrice { get; set; }
        
        public decimal Disc1 { get; set; }
        
        public int DiscType1 { get; set; }
        
        public decimal Disc2 { get; set; }
        
        public int DiscType2 { get; set; }
        
        public decimal Disc3 { get; set; }
        
        public int DiscType3 { get; set; }
        
        public decimal DiscTotal { get; set; }
        
        public decimal Total { get; set; }

        public string GroupName { get; set; }

        [NotMapped]
        public string RFQCode { get; set; }

        [NotMapped]
        public string ProductCode { get; set; }

        [NotMapped]
        public string Unit { get; set; }
    }
}
