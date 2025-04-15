using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
   public class UpdateUnitInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
