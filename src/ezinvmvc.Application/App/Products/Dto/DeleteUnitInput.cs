using Abp.Domain.Entities;


namespace ezinvmvc.App.Products.Dto
{
   public class DeleteUnitInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
