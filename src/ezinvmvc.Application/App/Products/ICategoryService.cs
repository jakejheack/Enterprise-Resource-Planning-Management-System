using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Products.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface ICategoryService : IApplicationService
    {

        //Task<IEnumerable<GetCategoryOutput>> GetCategories();
        Task<PagedResultDto<GetCategoryOutput>> GetCategories();
        Task CreateCategory(CreateCategoryInput input);
        Task UpdateCategory(UpdateCategoryInput input);
        Task DeleteCategory(DeleteCategoryInput input);
        Task<GetCategoryOutput> GetCategory(GetCategoryInput input);
    }
}
