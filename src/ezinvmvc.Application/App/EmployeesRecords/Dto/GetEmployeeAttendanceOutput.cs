using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesRecords.Dto
{
    public class GetEmployeeAttendanceOutput : FullAuditedEntity<int>
    {
        public int EmpId { get; set; }

        public DateTime? Date { get; set; }

        public DateTime? time { get; set; }

        public string Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
