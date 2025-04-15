using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.Models
{
    [Table("AppQuotationOtherItems")]
    public class QuotationOtherItem : FullAuditedEntity<int>
    {
        [Required]
        public int QuotationId { get; set; }

        public int IndexNo { get; set; }

        public string Name { get; set; }

        public string Area { get; set; }

        public string Description { get; set; }

        public string Dimension { get; set; }

        public string Quantity { get; set; }

        public string Description1 { get; set; }

        public int Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
