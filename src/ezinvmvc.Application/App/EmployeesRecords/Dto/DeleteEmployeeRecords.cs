using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesRecords.Dto
{
    public class DeleteEmployeeRecords : FullAuditedEntityDto<int>
    {
        public int EmpId { get; set; }

        public DateTime? Date { get; set; }

        public string Description { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
