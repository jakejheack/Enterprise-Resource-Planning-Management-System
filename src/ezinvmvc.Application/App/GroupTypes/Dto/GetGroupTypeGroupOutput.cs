using Abp.Domain.Entities;

namespace ezinvmvc.App.GroupTypes.Dto
{
    public class GetGroupTypeGroupOutput : Entity<int>
    {
        public string Description { get; set; }
    }
}
