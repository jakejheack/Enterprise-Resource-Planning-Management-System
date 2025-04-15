using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeesRecords.Dto
{
    public class UpdateEmployeeLeave : FullAuditedEntityDto<int?>
    {
        public int EmpId { get; set; }

        public DateTime? DateFrom { get; set; }

        public DateTime? DateTo { get; set; }

        public string Status { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        public string Description { get; set; }

        public string Wpay { get; set; }

        public string Leave { get; set; }

        public decimal? Rates { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public int LeaveId { get; set; }

        [NotMapped]
        public int LeaveEmpId { get; set; }

        [NotMapped]
        public string LeaveDescription { get; set; }

        [NotMapped]
        public DateTime? LeaveDateFrom { get; set; }

        [NotMapped]
        public DateTime? LeaveDateTo { get; set; }

        [NotMapped]
        public string LeaveStatus { get; set; }
    }
}
