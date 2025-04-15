using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
    public class UpdateCategoryInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
