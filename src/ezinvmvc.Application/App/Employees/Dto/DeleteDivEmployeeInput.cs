using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Employees.Dto
{
    public class DeleteDivEmployeeInput : FullAuditedEntityDto<int>
    {
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
