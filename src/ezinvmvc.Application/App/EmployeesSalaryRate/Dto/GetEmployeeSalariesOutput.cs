using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesSalaryRate.Dto
{
    public class GetEmployeeSalariesOutput : FullAuditedEntity<int>
    {
        [Required]
        public int EmpId { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? PayrollPeriod { get; set; }

        public int? PayrollRate { get; set; }

        public decimal? PayrollRatePerMonth { get; set; }

        public int? MonthCount { get; set; }

        public decimal? PayrollRatePerWeek { get; set; }

        public int? WeekCount { get; set; }

        public decimal? PayrollRatePerDay { get; set; }

        public int? DayCount { get; set; }

        public decimal? PayrollRatePerHour { get; set; }

        public int? HourCount { get; set; }

        public decimal? PayrollRatePerPiece { get; set; }

        public int? PieceCount { get; set; }

        public bool StrickOverTime { get; set; }

        public string Status { get; set; }

        public bool FlexiTime { get; set; }

        public decimal? DeductionLate { get; set; }

        public DateTime? TimeIn { get; set; }
        public DateTime? TimeIOut { get; set; }
        public DateTime? MinLate { get; set; }
        public int AttId { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string fullName { get; set; }

        [NotMapped]
        public string payrollP { get; set; }

        [NotMapped]
        public string payrollR { get; set; }

        [NotMapped]
        public decimal PayrollAmount { get; set; }

        [NotMapped]
        public string CivilStatus { get; set; }

        [NotMapped]
        public decimal DeptId { get; set; }

        [NotMapped]
        public string DeptName { get; set; }

        [NotMapped]
        public string EmployeeCode { get; set; }


    }
}
