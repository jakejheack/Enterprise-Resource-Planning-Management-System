using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Employees.Dto
{
    public class UpdateDepartmentInput : FullAuditedEntityDto<int?>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
