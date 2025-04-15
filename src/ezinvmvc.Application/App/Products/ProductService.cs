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
    public class ProductService : ezinvmvcAppServiceBase, IProductService
    {
        private readonly IProductManager _productManager;
        private readonly IProductUnitManager _productUnitManager;

        public ProductService(IProductManager productManager, IProductUnitManager productUnitManager)
        {
            _productManager = productManager;
            _productUnitManager = productUnitManager;
        }

        public async Task<int> CreateProduct(CreateProductInput input)
        {
            Product output = Mapper.Map<Product>(input);
            CheckErrors(await _productManager.CreateAsync(output));

            var productunit = new ProductUnit
            {
                ProductId = output.Id,
                UnitId = output.UnitId,
                Conversion = 1
            };
            CheckErrors(await _productUnitManager.CreateAsync(productunit));

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }
        public async Task DeleteProduct(DeleteProductInput input)
        {
            CheckErrors(await _productManager.DeleteAsync(input.Id));
        }
        public async Task<PagedResultDto<GetProductOutput>> GetProducts(GetProductListInput input)
        {
            var resultList = await _productManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetProductOutput>(listcount, ObjectMapper.Map<List<GetProductOutput>>(resultList));
        }

        public async Task<GetProductOutput> GetProduct(GetProductInput input)
        {
            var getbyid = await _productManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetProductOutput>(getbyid);
        }
        public async Task UpdateProduct(UpdateProductInput input)
        {
            Product output = Mapper.Map<UpdateProductInput, Product>(input);

            CheckErrors(await _productManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task<PagedResultDto<GetProductOutput>> GetProductByName(GetProductListInput input)
        {
            var resultList = await _productManager.GetByName(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetProductOutput>(listcount, ObjectMapper.Map<List<GetProductOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetProductUnitOutput>> GetProductUnits(GetProductUnitsInput input)
        {
            var resultList = await _productUnitManager.GetAllList(input.Id);
            int listcount = 0;
            return new PagedResultDto<GetProductUnitOutput>(listcount, ObjectMapper.Map<List<GetProductUnitOutput>>(resultList));
        }

        public async Task CreateProductUnit(CreateProductUnitInput input)
        {
            ProductUnit output = Mapper.Map<CreateProductUnitInput, ProductUnit>(input);
            CheckErrors(await _productUnitManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task DeleteProductUnit(DeleteProductUnitInput input)
        {
            CheckErrors(await _productUnitManager.DeleteAsync(input.Id));
        }

        public async Task<GetProductUnitOutput> GetProductUnit(GetProductUnitInput input)
        {
            var getbyid = await _productUnitManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetProductUnitOutput>(getbyid);
        }

        public async Task UpdateProductUnit(UpdateProductUnitInput input)
        {
            ProductUnit output = Mapper.Map<UpdateProductUnitInput, ProductUnit>(input);
            var product = await _productManager.GetByIdAsync(input.ProductId);
            product.UnitId = input.DefaultUnitId;

            CheckErrors(await _productManager.UpdateAsync(product));
            CheckErrors(await _productUnitManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
