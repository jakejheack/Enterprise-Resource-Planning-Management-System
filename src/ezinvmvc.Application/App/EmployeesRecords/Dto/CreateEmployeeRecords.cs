using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesRecords.Dto
{
    public class CreateEmployeeRecords : FullAuditedEntity<int>
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
