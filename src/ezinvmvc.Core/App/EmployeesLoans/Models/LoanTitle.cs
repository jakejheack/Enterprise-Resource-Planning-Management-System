using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesLoans.Models
{
    [Table("appLoanTitle")]
    public class LoanTitle : FullAuditedEntity<int>
    {
        [Required]
        public string LoanTitleName { get; set; }
    }
}
