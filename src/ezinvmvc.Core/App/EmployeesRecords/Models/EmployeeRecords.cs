using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.EmployeesRecords.Models
{
    [Table("appEmployeeRecords")]
    public class EmployeeRecords : FullAuditedEntity<int>
    {
        public int EmpId { get; set; }
        
        public DateTime? Date { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        public string Description { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
