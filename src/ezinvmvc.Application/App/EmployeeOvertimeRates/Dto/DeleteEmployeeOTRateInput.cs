using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeeOvertimeRates.Dto
{
    public class DeleteEmployeeOTRateInput : FullAuditedEntityDto<int>
    {
        public int EmpId { get; set; }

        public int TabId { get; set; }

        public string Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string FullName { get; set; }

        [NotMapped]
        public string TableName { get; set; }

        [NotMapped]
        public int? RegularDayHours { get; set; }
    }
}
