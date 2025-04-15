using Abp.Application.Services.Dto;

namespace ezinvmvc.App.Employees.Dto
{
    public class DeleteSectorInput : FullAuditedEntityDto<int>
    {
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
