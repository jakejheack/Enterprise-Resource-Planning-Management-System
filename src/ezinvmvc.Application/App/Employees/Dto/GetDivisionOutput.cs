using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Employees.Dto
{
    public class GetDivisionOutput : FullAuditedEntityDto<int>
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
