using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.EmployeePayroll.Dto
{
    public class CreatePayroll : FullAuditedEntity<int>
    {
        public CreatePayrollInput payroll { get; set; }
        public List<CreatePayrollOTDetailsInput> otdetails { get; set; }
        public List<CreatePayrollAllowanceAdjustmentInput> allowanceadj { get; set; }
        public List<CreatePayrollSSSLoanInput> sssdetails { get; set; }
        public List<CreatePayrollPagibigLoanInput> pgbdetails { get; set; }
        public List<CreatePayrollOtherLoanInput> othrloandetails { get; set; }
        public List<CreatePayrollOtherDeductionInput> othrdeddetails { get; set; }
        public List<CreatePayrollAttAdjustmentInput> attadjdetails { get; set; }
    }
}
