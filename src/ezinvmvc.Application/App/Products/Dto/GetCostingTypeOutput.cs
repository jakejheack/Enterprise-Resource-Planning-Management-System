using Abp.Domain.Entities;


namespace ezinvmvc.App.Products.Dto
{
   public class GetCostingTypeOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
