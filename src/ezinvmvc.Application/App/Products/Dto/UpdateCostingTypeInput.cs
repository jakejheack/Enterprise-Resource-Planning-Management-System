using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
   public class UpdateCostingTypeInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
