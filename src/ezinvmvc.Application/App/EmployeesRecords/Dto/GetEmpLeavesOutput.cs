using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesRecords.Dto
{
    public class GetEmpLeavesOutput : FullAuditedEntity<int>
    {
        public string Name { get; set; }

        public int Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string Leave { get; set; }

        [NotMapped]
        public string RemLeave { get; set; }

        [NotMapped]
        public int EmpId { get; set; }

        [NotMapped]
        public int LeaveId { get; set; }

    }
}
