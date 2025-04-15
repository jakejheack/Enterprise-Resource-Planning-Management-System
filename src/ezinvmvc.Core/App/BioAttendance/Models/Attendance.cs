using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.BioAttendance.Models
{
    [Table("appAttendance")]
    public class Attendance : FullAuditedEntity<int>
    {
        [Required]
        public string AttendanceId { get; set; }

        public string Company { get; set; }

        public string Name { get; set; }

        public int No { get; set; }

        public DateTime? Date { get; set; }

        public int LocId { get; set; }

        public int IdNumber { get; set; }

        public string VerifyCode { get; set; }

        public int CardNo { get; set; }

        public string Status { get; set; }

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
    }
}
