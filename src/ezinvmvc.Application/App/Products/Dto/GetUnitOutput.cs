using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
    public class GetUnitOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
