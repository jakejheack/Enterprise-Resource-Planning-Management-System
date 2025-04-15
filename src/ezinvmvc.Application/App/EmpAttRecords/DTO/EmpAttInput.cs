using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmpAttRecords.DTO
{
    public class EmpAttInput : FullAuditedEntity<int>
    {
        public int EmpId { get; set; }

        public string EmpCode { get; set; }

        public string AttId { get; set; }

        public DateTime? DateRecStart { get; set; }

        public DateTime? DateRecEnd { get; set; }

        public string TimeIn { get; set; }

        public string MinLate { get; set; }

        public string TimeIOut { get; set; }

        public int? NoHours { get; set; }

        public bool StrickOvertime { get; set; }

        public bool FlexiTime { get; set; }

        public int? OTNoHours { get; set; }

        public string Status { get; set; }

        public DateTime? Date { get; set; }

        public string Description1 { get; set; }

        public string Description2 { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string CompleteName { get; set; }
    }
}
