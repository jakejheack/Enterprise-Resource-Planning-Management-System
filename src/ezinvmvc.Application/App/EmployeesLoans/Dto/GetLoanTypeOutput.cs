using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ezinvmvc.App.EmployeesLoans.Dto
{
    public class GetLoanTypeOutput : FullAuditedEntity<int>
    {
        [Required]
        public int LoanTitleId { get; set; }

        [Required]
        public string LoanTypeName { get; set; }
    }
}
