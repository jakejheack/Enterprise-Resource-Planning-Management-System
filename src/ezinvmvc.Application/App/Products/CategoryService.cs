using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Products.Dto;

namespace ezinvmvc.App.Products
{
    public class CategoryService : ezinvmvcAppServiceBase, ICategoryService
    {
        private readonly ICategoryManager _categoryManager;

        public CategoryService(ICategoryManager categoryManager)
        {
            _categoryManager = categoryManager;
        }

        public async Task CreateCategory(CreateCategoryInput input)
        {
            Category output = Mapper.Map<Category>(input);
            CheckErrors(await _categoryManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteCategory(DeleteCategoryInput input)
        {
            CheckErrors(await _categoryManager.DeleteAsync(input.Id));
        }

        public async Task<GetCategoryOutput> GetCategory(GetCategoryInput input)
        {
            var getbyid = await _categoryManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetCategoryOutput>(getbyid);
        }

        public async Task UpdateCategory(UpdateCategoryInput input)
        {
            Category output = Mapper.Map<UpdateCategoryInput, Category>(input);
            CheckErrors(await _categoryManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
     
        public async  Task<PagedResultDto<GetCategoryOutput>> GetCategories()
        {
            var resultList = await _categoryManager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetCategoryOutput>(listcount, ObjectMapper.Map<List<GetCategoryOutput>>(resultList));
        }
    }
}
