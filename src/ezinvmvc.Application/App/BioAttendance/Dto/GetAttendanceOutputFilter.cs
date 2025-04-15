using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.BioAttendance.Dto
{
    public class GetAttendanceOutputFilter
    {
        [Required]
        public string AttendanceId { get; set; }

        public string Company { get; set; }

        [NotMapped]
        public DateTime DateT { get; set; }

        [NotMapped]
        public string CompanyName { get; set; }

        [NotMapped]
        public string StartDate { get; set; }

        [NotMapped]
        public string EndDate { get; set; }
    }
}
