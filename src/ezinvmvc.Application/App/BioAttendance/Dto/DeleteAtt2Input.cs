using Abp.Application.Services.Dto;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.BioAttendance.Dto
{
    public class DeleteAtt2Input : FullAuditedEntityDto<int>
    {
        //[Required]
        public string AttendanceId { get; set; }

        public int Company { get; set; }

        public int No { get; set; }

        public string Name { get; set; }

        public string Department { get; set; }

        public DateTime? Date { get; set; }

        public string AMIn { get; set; }

        public string AMOut { get; set; }

        public string PMIn { get; set; }

        public string PMOut { get; set; }

        public int Status1 { get; set; }

        public int Status2 { get; set; }

        public int Status3 { get; set; }

        public int Status4 { get; set; }

        public string Description1 { get; set; }

        public string Description2 { get; set; }

        public string Description3 { get; set; }

        public string Description4 { get; set; }

        public DateTime? DateRecorded { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public DateTime DateT { get; set; }

        [NotMapped]
        public string DateIn { get; set; }

        [NotMapped]
        public string TimeIn { get; set; }

        [NotMapped]
        public string TimeOut { get; set; }

        [NotMapped]
        public int Hours { get; set; }

        [NotMapped]
        public string Late { get; set; }

        [NotMapped]
        public string UTime { get; set; }

        [NotMapped]
        public int OT { get; set; }

        [NotMapped]
        public string Days { get; set; }

        [NotMapped]
        public string Holiday { get; set; }

        [NotMapped]
        public string EnTitlement { get; set; }

        [NotMapped]
        public string CompanyName { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }


        //start
        [NotMapped]
        public string AttId { get; set; }

        [NotMapped]
        public int TotalRows2 { get; set; }

        [NotMapped]
        public int EmpId { get; set; }

        [NotMapped]
        public string EmployeeCode { get; set; }

        [NotMapped]
        public string Holidays { get; set; }

        [NotMapped]
        public string HolRates { get; set; }

        [NotMapped]
        public string Datev { get; set; }

        [NotMapped]
        public string Day { get; set; }

        [NotMapped]
        public string AttDate { get; set; }

        [NotMapped]
        public string LunchOut { get; set; }

        [NotMapped]
        public string LunchIn { get; set; }

        [NotMapped]
        public string Timesched1id { get; set; }

        [NotMapped]
        public string Payrollrateid { get; set; }

        [NotMapped]
        public string FlexiTime { get; set; }

        [NotMapped]
        public string BreakOut { get; set; }

        [NotMapped]
        public string BreakIn { get; set; }

        [NotMapped]
        public string AmLateIn { get; set; }

        [NotMapped]
        public string AmLAteEndIn { get; set; }

    }
}
