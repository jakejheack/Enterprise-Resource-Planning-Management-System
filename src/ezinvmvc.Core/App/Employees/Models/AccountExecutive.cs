using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Employees.Models
{
    [Table("AppAccountExecutives")]
    public class AccountExecutive : FullAuditedEntity<int>
    {
        [Required]
        public int ReferenceId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string Reference { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        public DateTime AssignedDate { get; set; }

        public bool IsActive { get; set; }

        public string Notes { get; set; } 

        [NotMapped]
        public string EmployeeName { get; set; }

        [NotMapped]
        public string ReferenceCode { get; set; }

        [NotMapped]
        public string ReferenceName { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
