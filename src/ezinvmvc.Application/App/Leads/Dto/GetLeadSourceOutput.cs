using Abp.Domain.Entities;

namespace ezinvmvc.App.Leads.Dto
{
    public class GetLeadSourceOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
