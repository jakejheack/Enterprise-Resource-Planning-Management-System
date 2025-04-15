using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmpAttRecords.DTO
{
    public class GetEmpAttPayrollOutput
    {
        public int EmpId { get; set; }

        public string AttId { get; set; }

        [NotMapped]
        public decimal BasicSalaryCurrent { get; set; }
        [NotMapped]
        public decimal BasicSalaryAdjustment { get; set; }
        [NotMapped]
        public decimal BasicSalaryAmount { get; set; }
        [NotMapped]
        public decimal AbsensesCurrent { get; set; }
        [NotMapped]
        public decimal AbsensesAdjustment { get; set; }
        [NotMapped]
        public decimal AbsensesAmount { get; set; }
        [NotMapped]
        public string TardinessCurrent { get; set; }
        [NotMapped]
        public string TardinessAjustment { get; set; }
        [NotMapped]
        public decimal TardinessAmount { get; set; }
        [NotMapped]
        public string UndertimeCurrent { get; set; }
        [NotMapped]
        public string UndertimeAdjustment { get; set; }
        [NotMapped]
        public decimal UndertimeAmount { get; set; }
        [NotMapped]
        public decimal RGOTCurrent { get; set; }
        [NotMapped]
        public decimal RGOTAdjustment { get; set; }
        [NotMapped]
        public decimal RGOTAmount { get; set; }
        [NotMapped]
        public decimal GeneralCurrent { get; set; }
        [NotMapped]
        public decimal GeneralAdjustment { get; set; }
        [NotMapped]
        public decimal GeneralAmount { get; set; }
        [NotMapped]
        public decimal SSSCurrent { get; set; }
        [NotMapped]
        public decimal SSSAdjustment { get; set; }
        [NotMapped]
        public decimal SSSAmount { get; set; }
        [NotMapped]
        public decimal PhilhealthCurrent { get; set; }
        [NotMapped]
        public decimal PhilhealthAdjustment { get; set; }
        [NotMapped]
        public decimal PhilhealthAmount { get; set; }
        [NotMapped]
        public decimal PagibigCurrent { get; set; }
        [NotMapped]
        public decimal PagibigAjustment { get; set; }
        [NotMapped]
        public decimal PagibigAmount { get; set; }
        [NotMapped]
        public decimal TaxWithHealdCurrent { get; set; }
        [NotMapped]
        public decimal TaxWithHealdAdjustment { get; set; }
        [NotMapped]
        public decimal TaxWithHealdAmount { get; set; }
        [NotMapped]
        public decimal SSSLoanCurrent { get; set; }
        [NotMapped]
        public decimal SSSLoanAdjustment { get; set; }
        [NotMapped]
        public decimal SSSLoanAmount { get; set; }
        [NotMapped]
        public decimal PagibigLoanCurrent { get; set; }
        [NotMapped]
        public decimal PagibigLoanAdjustment { get; set; }
        [NotMapped]
        public decimal PagibigLoanAmount { get; set; }
        [NotMapped]
        public decimal OtherLoanCurrent { get; set; }
        [NotMapped]
        public decimal OtherLoanAdjustment { get; set; }
        [NotMapped]
        public decimal OtherLoanAmount { get; set; }

        [NotMapped]
        public decimal ER { get; set; }
        [NotMapped]
        public decimal EE { get; set; }
        [NotMapped]
        public decimal Total { get; set; }

        [NotMapped]
        public decimal ERC { get; set; }
        [NotMapped]
        public decimal ECC { get; set; }
        [NotMapped]
        public decimal TotalECC { get; set; }

        [NotMapped]
        public decimal Percent { get; set; }
        [NotMapped]
        public decimal Amount { get; set; }
        [NotMapped]
        public decimal Startamount { get; set; }
        [NotMapped]
        public decimal Prescribe { get; set; }


        [NotMapped]
        public DateTime? DateStart { get; set; }
        [NotMapped]
        public DateTime? DatEnd { get; set; }
        [NotMapped]
        public decimal LoanAmount { get; set; }
        [NotMapped]
        public decimal LoanBalance { get; set; }
        [NotMapped]
        public string LoanTypeName { get; set; }
        [NotMapped]
        public string DeductionType { get; set; }
        [NotMapped]
        public decimal EmpLoan { get; set; }
        [NotMapped]
        public string ApplicationNo { get; set; }
    }
}
