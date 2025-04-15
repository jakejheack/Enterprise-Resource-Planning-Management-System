using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
    public class GetCategoryOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
