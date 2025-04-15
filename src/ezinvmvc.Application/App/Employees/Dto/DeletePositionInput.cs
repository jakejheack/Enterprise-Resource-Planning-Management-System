using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Employees.Dto
{
    public class DeletePositionInput : FullAuditedEntityDto<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Description { get; set; }

        public int DepartmentId { get; set; }

        public int SectorId { get; set; }
    }
}
