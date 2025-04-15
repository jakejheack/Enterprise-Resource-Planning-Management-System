using Abp.Domain.Entities;


namespace ezinvmvc.App.Products.Dto
{
    public class DeleteBrandInput : Entity<int>
    {
        public string Name { get; set; }
    }
}
