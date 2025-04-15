using Abp.Domain.Entities;

namespace ezinvmvc.App.Clients.Dto
{
    public class DeleteIndustryInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
