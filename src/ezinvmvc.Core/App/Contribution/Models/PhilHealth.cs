using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Contribution
{
    [Table("AppPhilHealth")]
    public class PhilHealth : FullAuditedEntity<int>
    {
        public string Name { get; set; }

        public decimal Start { get; set; }

        public decimal End { get; set; }

        public decimal basic { get; set; }

        public string Year { get; set; }

        public decimal Percent { get; set; }
    }
}
