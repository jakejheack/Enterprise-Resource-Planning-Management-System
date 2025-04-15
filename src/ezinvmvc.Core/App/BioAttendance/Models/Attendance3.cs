using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.BioAttendance.Models
{
    [Table("appAttendance3")]
    public class Attendance3 : FullAuditedEntity<int>
    {
        [Required]
        public string AttendanceId { get; set; }

        public int Company { get; set; }

        public int No { get; set; }

        public string Name { get; set; }

        public string Department { get; set; }

        public string Date { get; set; }

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

    }
}
