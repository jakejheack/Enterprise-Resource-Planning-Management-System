using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Employees.Dto
{
    public class UpdateDivisionInput : FullAuditedEntityDto<int?>
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
