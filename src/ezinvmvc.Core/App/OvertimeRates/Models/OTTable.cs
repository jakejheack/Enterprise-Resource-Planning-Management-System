using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.OvertimeRates
{
    [Table("AppOTTables")]
    public class OTTable : FullAuditedEntity<int>
    {
        public string OTDescription { get; set; }

        public int? EffectivenumberHour { get; set; }

        public DateTime? EffectiveTime { get; set; }

        public decimal? PercentPerOTHour { get; set; }
        
        public string Status { get; set; }

        public DateTime? EffectiveTime2 { get; set; }

        public decimal? PercentPerOTHour2 { get; set; }
    }
}
