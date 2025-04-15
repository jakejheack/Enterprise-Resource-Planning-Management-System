using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ezinvmvc.App.BioAttendance.Dto
{
    public class CreateBioAttendanceInput
    {
        public AttendanceInput attid { get; set; }
        public List<AttendanceItemInput> attendanceitem { get; set; }
    }
}
