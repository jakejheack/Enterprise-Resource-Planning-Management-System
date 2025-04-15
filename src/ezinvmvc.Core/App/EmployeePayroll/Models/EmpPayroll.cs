using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeePayroll.Models
{
    [Table("AppEmpPayroll")]
    public class EmpPayroll : FullAuditedEntity<int>
    {
        public int EmpId { get; set; }

        public string AttId { get; set; }

        public int Department { get; set; }

        public string PayrollPeriod { get; set; }

        public string Period { get; set; }

        public string PayrollMonthly { get; set; }

        public string PayrollRate { get; set; }

        public string CivilStatus { get; set; }

        public string Status { get; set; }

        public decimal BasicSalaryCurrent { get; set; }
        public decimal BasicSalaryAdjustment { get; set; }
        public decimal BasicSalaryAmount { get; set; }

        public decimal AbsensesCurrent { get; set; }
        public decimal AbsensesAdjustment { get; set; }
        public decimal AbsensesAmount { get; set; }

        public string TardinessCurrent { get; set; }
        public string TardinessAjustment { get; set; }
        public decimal TardinessAmount { get; set; }

        public string UndertimeCurrent { get; set; }
        public decimal UndertimeAdjustment { get; set; }
        public decimal UndertimeAmount { get; set; }

        public decimal RGOTCurrent { get; set; }
        public decimal RGOTAdjustment { get; set; }
        public decimal RGOTAmount { get; set; }

        public decimal GeneralCurrent { get; set; }
        public decimal GeneralAdjustment { get; set; }
        public decimal GeneralAmount { get; set; }

        public decimal NONGeneralCurrent { get; set; }
        public decimal NONGeneralAdjustment { get; set; }
        public decimal NONGeneralAmount { get; set; }

        public decimal GrossAmount { get; set; }

        public decimal SSSCurrent { get; set; }
        public decimal SSSAdjustment { get; set; }
        public decimal SSSAmount { get; set; }

        public decimal PhilhealthCurrent { get; set; }
        public decimal PhilhealthAdjustment { get; set; }
        public decimal PhilhealthAmount { get; set; }

        public decimal PagibigCurrent { get; set; }
        public decimal PagibigAjustment { get; set; }
        public decimal PagibigAmount { get; set; }

        public decimal ContributionAmount { get; set; }        

        public decimal SSSLoanCurrent { get; set; }
        public decimal SSSLoanAdjustment { get; set; }
        public decimal SSSLoanAmount { get; set; }

        public decimal PagibigLoanCurrent { get; set; }
        public decimal PagibigLoanAdjustment { get; set; }
        public decimal PagibigLoanAmount { get; set; }

        public decimal OtherLoanCurrent { get; set; }
        public decimal OtherLoanAdjustment { get; set; }
        public decimal OtherLoanAmount { get; set; }

        public decimal LoansAmount { get; set; }

        public decimal TaxableAmount { get; set; }
        public decimal Percent { get; set; }
        public decimal Prescribe { get; set; }

        public decimal NetIncome { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
