using Abp.Domain.Entities;

namespace ezinvmvc.App.Products.Dto
{
    public class DeleteCategoryInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
