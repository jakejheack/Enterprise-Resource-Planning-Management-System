using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesLoans.Models
{
    [Table("appLoanType")]
    public class LoanType : FullAuditedEntity<int>
    {
        [Required]
        public int LoanTitleId{ get; set; }

        [Required]
        public string LoanTypeName { get; set; }
    }
}
