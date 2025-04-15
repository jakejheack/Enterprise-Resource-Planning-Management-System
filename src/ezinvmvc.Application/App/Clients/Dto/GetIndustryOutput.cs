using Abp.Domain.Entities;

namespace ezinvmvc.App.Clients.Dto
{
    public class GetIndustryOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
