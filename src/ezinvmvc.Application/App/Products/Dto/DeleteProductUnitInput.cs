using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
   public class DeleteProductUnitInput : Entity<int>
    {
        public int ProductId { get; set; }
        public int UnitId { get; set; }
        public decimal Conversion { get; set; }
    }
}
