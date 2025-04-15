using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
    public class GetPricingTypeOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
