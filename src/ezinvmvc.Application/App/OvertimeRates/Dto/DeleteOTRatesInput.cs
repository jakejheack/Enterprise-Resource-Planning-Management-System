using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.OvertimeRates.Dto
{
    public class DeleteOTRatesInput : FullAuditedEntityDto<int>
    {
        public string RateDescription { get; set; }

        public decimal Regural { get; set; }
        public decimal RestDay { get; set; }
        public decimal SpecialHoliday { get; set; }
        public decimal LegalHoliday { get; set; }
        public decimal SpecialHolidayRestday { get; set; }
        public decimal LegalHolidayRestday { get; set; }

        public decimal ReguralOT { get; set; }
        public decimal RestDayOT { get; set; }
        public decimal SpecialHolidayOT { get; set; }
        public decimal LegalHolidayOT { get; set; }
        public decimal SpecialHolidayRestdayOT { get; set; }
        public decimal LegalHolidayRestdayOT { get; set; }

        public decimal NDRegural { get; set; }
        public decimal NDRestDay { get; set; }
        public decimal NDSpecialHoliday { get; set; }
        public decimal NDLegalHoliday { get; set; }
        public decimal NDSpecialHolidayRestday { get; set; }
        public decimal NDLegalHolidayRestday { get; set; }

        public decimal NDReguralOT { get; set; }
        public decimal NDRestDayOT { get; set; }
        public decimal NDSpecialHolidayOT { get; set; }
        public decimal NDLegalHolidayOT { get; set; }
        public decimal NDSpecialHolidayRestdayOT { get; set; }
        public decimal NDLegalHolidayRestdayOT { get; set; }

        //Extraonly
        public decimal Descimal1 { get; set; }
        public decimal Descimal2 { get; set; }
        public decimal Descimal3 { get; set; }
        public decimal Descimal4 { get; set; }
        public decimal Descimal5 { get; set; }
        public decimal Descimal6 { get; set; }
        public decimal Descimal7 { get; set; }
        public decimal Descimal8 { get; set; }

        public string Status1 { get; set; }
        public string Status2 { get; set; }
        public string Status3 { get; set; }
        public string Status4 { get; set; }
        public string Status5 { get; set; }

        public string Desc1 { get; set; }
        public string Desc2 { get; set; }
        public string Desc3 { get; set; }
        public string Desc4 { get; set; }
        public string Desc5 { get; set; }
        //Extraonly
        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string Reguralstring { get; set; }
        [NotMapped]
        public string RestDaystring { get; set; }
        [NotMapped]
        public string SpecialHolidaystring { get; set; }
        [NotMapped]
        public string LegalHolidaystring { get; set; }
        [NotMapped]
        public string SpecialHolidayRestdaystring { get; set; }
        [NotMapped]
        public string LegalHolidayRestdaystring { get; set; }
        [NotMapped]
        public string ReguralOTstring { get; set; }
        [NotMapped]
        public string RestDayOTstring { get; set; }
        [NotMapped]
        public string SpecialHolidayOTstring { get; set; }
        [NotMapped]
        public string LegalHolidayOTstring { get; set; }
        [NotMapped]
        public string SpecialHolidayRestdayOTstring { get; set; }
        [NotMapped]
        public string LegalHolidayRestdayOTstring { get; set; }
        [NotMapped]
        public string NDReguralstring { get; set; }
        [NotMapped]
        public string NDRestDaystring { get; set; }
        [NotMapped]
        public string NDSpecialHolidaystring { get; set; }
        [NotMapped]
        public string NDLegalHolidaystring { get; set; }
        [NotMapped]
        public string NDSpecialHolidayRestdaystring { get; set; }
        [NotMapped]
        public string NDLegalHolidayRestdaystring { get; set; }
        [NotMapped]
        public string NDReguralOTstring { get; set; }
        [NotMapped]
        public string NDRestDayOTstring { get; set; }
        [NotMapped]
        public string NDSpecialHolidayOTstring { get; set; }
        [NotMapped]
        public string NDLegalHolidayOTstring { get; set; }
        [NotMapped]
        public string NDSpecialHolidayRestdayOTstring { get; set; }
        [NotMapped]
        public string NDLegalHolidayRestdayOTstring { get; set; }
    }
}
