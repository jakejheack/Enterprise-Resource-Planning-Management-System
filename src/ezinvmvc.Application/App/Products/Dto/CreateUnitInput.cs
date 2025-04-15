using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
    public class CreateUnitInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
