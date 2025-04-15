using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Contribution
{
    [Table("AppSSS")]
    public class SSS : FullAuditedEntity<int>
    {
        public string Name { get; set; }

        public string Year { get; set; }

        public decimal Start { get; set; }

        public decimal End { get; set; }

        public decimal Credit { get; set; }

        public decimal ER { get; set; }

        public decimal EE { get; set; }

        public decimal Total { get; set; }

        public decimal ERC { get; set; }

        public decimal ECC { get; set; }

        public decimal TotaEC { get; set; }

        
    }
}
