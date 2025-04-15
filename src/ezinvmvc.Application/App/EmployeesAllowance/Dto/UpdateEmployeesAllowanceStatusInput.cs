using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ezinvmvc.App.EmployeesAllowance.Dto
{
    public class UpdateEmployeesAllowanceStatusInput : FullAuditedEntity<int>
    {
        [Required]
        public int EmpId { get; set; }

        public string Status { get; set; }
    }
}
