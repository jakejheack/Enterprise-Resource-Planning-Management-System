using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesSalaryRate.Dto
{
    public class DeleteEmpSalariesInput : FullAuditedEntity<int>
    {
        [Required]
        public int EmpId { get; set; }

        public int? SalaryPeriod { get; set; }

        public int? PayrollPeriod { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public decimal? TaxWHeld { get; set; }

        public decimal? PayrollRatePerMonth { get; set; }

        public decimal? PayrollRatePerDay { get; set; }

        public decimal? PayrollRatePerHour { get; set; }

        public decimal? Laterate { get; set; }

        public decimal? Undertime { get; set; }

        public string aYear { get; set; }

        public string Amonth { get; set; }

        public string halfmonth { get; set; }

        public string aWeek { get; set; }

        public string aDay { get; set; }

        public string aHour { get; set; }

        public int? Payrollrateid { get; set; }

        public int? Timesched1id { get; set; }

        public int? HolidaySchedid { get; set; }

        public string Description { get; set; }

        public string SLeave { get; set; }

        public string VLeave { get; set; }

        public string TotalLeave { get; set; }

        public int? Workers { get; set; }
        public int Shift { get; set; }
        public string PL { get; set; }
        public string SIL { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
