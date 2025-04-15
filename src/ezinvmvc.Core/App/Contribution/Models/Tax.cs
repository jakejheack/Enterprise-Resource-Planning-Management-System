using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Contribution
{
    [Table("AppTax")]
    public class Tax : FullAuditedEntity<int>
    {
        public string Compensation { get; set; }

        public decimal Startamount { get; set; }

        public decimal EndAmount { get; set; }

        public decimal Percent { get; set; }

        public decimal Prescribe { get; set; }
    }
}
