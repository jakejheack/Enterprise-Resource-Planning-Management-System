using Abp.Application.Services.Dto;

namespace ezinvmvc.App.GroupTypes.Dto
{
    public class GetGroupTypeOutput : FullAuditedEntityDto<int>
    {
        public string GroupTypes { get; set; }

        public string Group { get; set; }

        public string Description { get; set; }

        public int Ids { get; set; }

        public string Status { get; set; }
    }
}
