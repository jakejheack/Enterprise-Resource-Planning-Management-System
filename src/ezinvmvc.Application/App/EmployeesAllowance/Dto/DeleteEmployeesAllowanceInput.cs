using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesAllowance.Dto
{
    public class DeleteEmployeesAllowanceInput : FullAuditedEntity<int>
    {
        [Required]
        public int EmpId { get; set; }

        public string Description { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? Period { get; set; }

        public decimal? Amount { get; set; }

        public string Status { get; set; }

        public bool? Taxable { get; set; }

        public bool? Deminimis { get; set; }

        public bool? Cola { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string FullName { get; set; }

        [NotMapped]
        public string EmpCode { get; set; }

        [NotMapped]
        public string AllowanceP { get; set; }

        [NotMapped]
        public decimal EmpAllowance { get; set; }
    }
}
