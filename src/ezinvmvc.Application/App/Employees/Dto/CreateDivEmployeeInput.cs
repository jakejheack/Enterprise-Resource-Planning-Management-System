using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ezinvmvc.App.Employees.Dto
{
    public class CreateDivEmployeeInput : FullAuditedEntity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
