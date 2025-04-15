using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.BioAttendance.Dto
{
    public class AttendanceInput
    {
        public string AttendanceId { get; set; }

        public int EmpId { get; set; }

        public string Days { get; set; }
    }
}
