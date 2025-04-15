using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
   public class UpdatePricingTypeInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
