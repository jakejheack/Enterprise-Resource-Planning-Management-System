using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Contribution
{
    [Table("AppPagIbig")]
    public class PagIbig : FullAuditedEntity<int>
    {
        public string Name { get; set; }

        public string Year { get; set; }

        public decimal Percent { get; set; }

        public decimal Amount { get; set; }
    }
}
