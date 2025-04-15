using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ezinvmvc.App.EmployeesLoans.Dto
{
    public class CreateLoanTitleInput : FullAuditedEntity<int>
    {
        [Required]
        public string LoanTitleName { get; set; }
    }
}
