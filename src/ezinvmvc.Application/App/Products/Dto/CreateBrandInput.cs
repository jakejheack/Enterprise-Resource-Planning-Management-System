using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
    public class CreateBrandInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
