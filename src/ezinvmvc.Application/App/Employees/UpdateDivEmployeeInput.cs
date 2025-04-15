using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ezinvmvc.App.Employees
{
    public class UpdateDivEmployeeInput : FullAuditedEntityDto<int?> 
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Description { get; set; }
    }
}
