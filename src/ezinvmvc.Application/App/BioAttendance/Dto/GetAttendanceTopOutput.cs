using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.BioAttendance.Dto
{
    public class GetAttendanceTopOutput : FullAuditedEntity<int>
    {
        public DateTime? Date { get; set; }
    }
}
