using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Products.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.Products
{
    [AbpAuthorize(PermissionNames.Master_Products)]
    public class ProductPriceService : ezinvmvcAppServiceBase, IProductPriceService
    {
        private readonly IProductPriceManager _manager;

        public ProductPriceService(IProductPriceManager manager)
        {
            _manager = manager;
        }

        public async Task CreateProductPrice(CreateProductPriceInput input)
        {
            ProductPrice output = Mapper.Map<CreateProductPriceInput, ProductPrice>(input);
            CheckErrors(await _manager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteProductPrice(DeleteProductPriceInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<GetProductPriceOutput> GetProductPrice(int id)
        {
            var getbyid = await _manager.GetByIdAsync(id);
            return Mapper.Map<GetProductPriceOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetProductPriceOutput>> GetProductPrices(GetProductPricesInput input)
        {
            var resultList = await _manager.GetAllList(input.ProductId,input.PricingTypeId,input.UnitId);
            int listcount = 0;
            return new PagedResultDto<GetProductPriceOutput>(listcount, ObjectMapper.Map<List<GetProductPriceOutput>>(resultList));
        }

        public async Task UpdateProductPrice(UpdateProductPriceInput input)
        {
            ProductPrice output = Mapper.Map<UpdateProductPriceInput, ProductPrice>(input);

            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
