using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
   public class CreateCostingTypeInput : Entity<int>
    {
        public string Name { get; set; }

    }
}
