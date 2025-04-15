using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Products.Dto;

namespace ezinvmvc.App.Products
{
    public class BrandService : ezinvmvcAppServiceBase, IBrandService
    {
        private readonly IBrandManager _brandManager;

        public BrandService(IBrandManager brandManager)
        {
            _brandManager = brandManager;
        }

        public async Task CreateBrand(CreateBrandInput input)
        {
            Brand output = Mapper.Map<Brand>(input);
            CheckErrors(await _brandManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteBrand(DeleteBrandInput input)
        {
            CheckErrors(await _brandManager.DeleteAsync(input.Id));
        }
      
        public async Task<PagedResultDto<GetBrandOutput>> GetBrands()
        {
            var resultList = await _brandManager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetBrandOutput>(listcount, ObjectMapper.Map<List<GetBrandOutput>>(resultList));
        }

        public async Task<GetBrandOutput> GetBrand(GetBrandInput input)
        {
            var getbyid = await _brandManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetBrandOutput>(getbyid);
        }

        public async Task UpdateBrand(UpdateBrandInput input)
        {
            Brand output = Mapper.Map<Brand>(input);
            CheckErrors(await _brandManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
