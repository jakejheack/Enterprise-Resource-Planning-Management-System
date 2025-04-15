using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.OvertimeRates
{
    [Table("AppOvertimeRate")]
    public class OvertimeRate : FullAuditedEntity<int>
    {
        [Required]
        public string TableName { get; set; }

        public string RegularDayDescription { get; set; }
        public string RestDayDescription { get; set; }
        public string SpecialHolidayDescription { get; set; }
        public string LegalHolidayDescription { get; set; }
        public string SpecialHolidayRDDescription { get; set; }
        public string LegalHolidayRDDescription { get; set; }
        public string DoubleHolidayDescription { get; set; }
        public string DoubleHolidayRDDescription { get; set; }

        public int? RegularDayHours { get; set; }
        public int? RestDayHour { get; set; }
        public int? SpecialHolidayHour { get; set; }
        public int? LegalHolidayHour { get; set; }
        public int? SpecialHolidayRDHour { get; set; }
        public int? LegalHolidayRDHour { get; set; }
        public int? DoubleHolidayHour { get; set; }
        public int? DoubleHolidayRDHour { get; set; }

        public decimal? RegularDay { get; set; }
        public decimal? RestDay { get; set; }
        public decimal? SpecialHoliday { get; set; }
        public decimal? LegalHoliday { get; set; }
        public decimal? SpecialHolidayRD { get; set; }
        public decimal? LegalHolidayRD { get; set; }
        public decimal? DoubleHoliday { get; set; }
        public decimal? DoubleHolidayRD { get; set; }

        public decimal? RegularDayOT { get; set; }
        public decimal? RestDayOT { get; set; }
        public decimal? SpecialHolidayOT { get; set; }
        public decimal? LegalHolidayOT { get; set; }
        public decimal? SpecialHolidayRDOT { get; set; }
        public decimal? LegalHolidayRDOT { get; set; }
        public decimal? DoubleHolidayDOT { get; set; }
        public decimal? DoubleHolidayRDOT { get; set; }

        public decimal? RegularDayND { get; set; }
        public decimal? RestDayND { get; set; }
        public decimal? SpecialHolidayND { get; set; }
        public decimal? LegalHolidayND { get; set; }
        public decimal? SpecialHolidayRDND { get; set; }
        public decimal? LegalHolidayRDND { get; set; }
        public decimal? DoubleHolidayDND { get; set; }
        public decimal? DoubleHolidayRDND { get; set; }

        public decimal? RegularDayNDOT { get; set; }
        public decimal? RestDayNDOT { get; set; }
        public decimal? SpecialHolidayNDOT { get; set; }
        public decimal? LegalHolidayNDOT { get; set; }
        public decimal? SpecialHolidayRDNDOT { get; set; }
        public decimal? LegalHolidayRDNDOT { get; set; }
        public decimal? DoubleHolidayNDOT { get; set; }
        public decimal? DoubleHolidayRDNDOT { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
