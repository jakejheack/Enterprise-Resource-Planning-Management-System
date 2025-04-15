using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesRecords.Dto
{
    public class DeleteEmployeeAttendance : FullAuditedEntityDto<int>
    {
        public int EmpId { get; set; }

        public DateTime? Date { get; set; }

        public DateTime? time { get; set; }

        public string Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
