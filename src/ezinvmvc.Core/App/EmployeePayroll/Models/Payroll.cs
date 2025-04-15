using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeePayroll.Models
{
    [Table("AppPayroll")]
    public class Payroll : FullAuditedEntity<int>
    {
        public int EmpId { get; set; }

        public string AttId { get; set; }

        public int rateid { get; set; }

        public int Periodid { get; set; }

        public int SalaryPeriod { get; set; }        

        public int CutOff { get; set; }

        public decimal RatePerMonth { get; set; }

        public decimal RatePerDay { get; set; }
        
        public decimal RatePerHour { get; set; }

        public decimal BasicSalaryCurrent { get; set; }

        public decimal BasicSalaryAdjustment { get; set; }

        public decimal BasicSalaryAmount { get; set; }

        public decimal AbsensesCurrent { get; set; }

        public decimal AbsensesAdjustment { get; set; }

        public decimal AbsensesAmount { get; set; }

        public string TardinessCurrent { get; set; }

        public decimal TardinessAjustment { get; set; }

        public decimal TardinessAmount { get; set; }

        public string UndertimeCurrent { get; set; }

        public decimal UndertimeAdjustment { get; set; }

        public decimal UndertimeAmount { get; set; }

        public decimal LeaveUse { get; set; }

        public decimal LeaveAmout { get; set; }

        public decimal LeaveTotalAmout { get; set; }

        public decimal RGOTAmount { get; set; }

        public decimal AllowanceAdjs { get; set; }

        public decimal GeneralAmount { get; set; }

        public decimal NONGeneralAmount { get; set; }

        public decimal GrossAmount { get; set; }

        public decimal AttAdjs { get; set; }

        public int NightDiffval { get; set; }

        public string NightDiffCurrent { get; set; }

        public decimal NightDiffAdjustment { get; set; }

        public decimal NightDiffAmount { get; set; }

        public string TravelhoursCurrent { get; set; }

        public decimal TravelhoursAdjustment { get; set; }

        public decimal TravelhoursAmount { get; set; }

        public string HolidayCurrent { get; set; }

        public decimal HolidayAdjustment { get; set; }

        public decimal HolidayAmount { get; set; }

        //Contribution
        public decimal SSSEEAmount { get; set; }

        public decimal SSSERAmount { get; set; }

        public decimal SSSECAmount { get; set; }

        public decimal PhilhealthEEAmount { get; set; }

        public decimal PhilhealthERAmount { get; set; }

        public decimal PhilhealthTotalAmount { get; set; }

        public decimal PagibigEEAmount { get; set; }

        public decimal PagibigERAmount { get; set; }

        public decimal PagibigTotalAmount { get; set; }

        //loans        
        public decimal SSSLoanAmount { get; set; }

        public decimal PagibigLoanAmount { get; set; }

        public decimal OtherLoanAmount { get; set; }

        public decimal OtherLoan{ get; set; }

        public decimal TaxHeld { get; set; }

        public decimal LoansAmount { get; set; }

        //net
        public decimal TaxableAmount { get; set; }

        public decimal Percent { get; set; }

        public decimal Prescribe { get; set; }

        public decimal NetIncome { get; set; }

        public string Status { get; set; }

        //description unused
        public string Description1 { get; set; }

        public string Description2 { get; set; }

        public string Description3 { get; set; }

        public string Status1 { get; set; }

        public string Status2 { get; set; }

        public string Status3 { get; set; }

        public int LeaveId { get; set; }

        public string Year { get; set; }

        [NotMapped]
        public string LastName { get; set; }

        [NotMapped]
        public string FirstName { get; set; }

        [NotMapped]
        public string MiddleName { get; set; }

        [NotMapped]
        public string Department { get; set; }

        [NotMapped]
        public string PayrollPeriod { get; set; }

        [NotMapped]
        public string PayrollSalaryPeriod { get; set; }

        [NotMapped]
        public string EmpCode { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
