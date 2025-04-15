using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesAllowance.Models
{
    [Table("appEmployeeAllowances")]
    public class EmployeeAllowances : FullAuditedEntity<int>
    {
        [Required]
        public int EmpId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime? StartDate { get; set; }

        [Required]
        public DateTime? EndDate { get; set; }

        [Required]
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
