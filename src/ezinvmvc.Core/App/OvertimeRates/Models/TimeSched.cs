using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.OvertimeRates
{
    [Table("AppTimeSched")]
    public class TimeSched : FullAuditedEntity<int>
    {
        public int FlexiTime { get; set; }

        public int WithOverTime { get; set; }

        public string TimeDescription { get; set; }

        public string AMIn { get; set; }

        public string AMBreakFastOut { get; set; }

        public string AMBreakFastIn { get; set; }

        public string BreakOut { get; set; }

        public string BreakIn { get; set; }

        public string CoffeeBreakOut { get; set; }

        public string CoffeeBreakIn { get; set; }

        public string pmOut { get; set; }

        public string amLateIn { get; set; }

        public string amLAteEndIn { get; set; }

        public string pmLateIn { get; set; }

        public string pmLateEndIn { get; set; }

        public string Status { get; set; }

        //not used
        public string In1 { get; set; }
        public string In2 { get; set; }
        public string In3 { get; set; }
        public string In4 { get; set; }
        public string In5 { get; set; }

        public string Out1 { get; set; }
        public string Out2 { get; set; }
        public string Out3 { get; set; }
        public string Out4 { get; set; }
        public string Out5 { get; set; }

        public string Status1 { get; set; }
        public string Status2 { get; set; }
        public string Status3 { get; set; }
        public string Status4 { get; set; }
        public string Status5 { get; set; }
        //not used

        [NotMapped]
        public int TotalRows { get; set; }


    }
}
