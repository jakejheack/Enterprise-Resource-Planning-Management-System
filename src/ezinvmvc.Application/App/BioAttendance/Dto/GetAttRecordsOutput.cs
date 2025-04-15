using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.BioAttendance.Dto
{
    public class GetAttRecordsOutput : Entity<int>
    {
        public int AttId { get; set; }

        public int TotalRows2 { get; set; }

        public int TotalRows { get; set; }

        public string AttendanceId { get; set; }

        public int EmpId { get; set; }

        public string EmployeeCode { get; set; }

        public string Department { get; set; }

        public string DateRecorded { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string Name { get; set; }

        public string Holidays { get; set; }

        public string HolRates { get; set; }

        public string Datev { get; set; }

        public string Day { get; set; }

        public string AttDate { get; set; }

        public string TimeIn { get; set; }

        public string LunchOut { get; set; }

        public string LunchIn { get; set; }

        public string TimeOut { get; set; }

        public string Timesched1id { get; set; }

        public string Payrollrateid { get; set; }

        public string FlexiTime { get; set; }

        public string AMIn { get; set; }

        public string BreakOut { get; set; }

        public string BreakIn { get; set; }

        public string PmOut { get; set; }

        public string AmLateIn { get; set; }

        public string AmLAteEndIn { get; set; }
    }
}
