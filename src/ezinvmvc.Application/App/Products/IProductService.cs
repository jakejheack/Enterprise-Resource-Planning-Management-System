using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Products.Dto;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface IProductService : IApplicationService
    {
        Task<PagedResultDto<GetProductOutput>> GetProducts(GetProductListInput input);
        Task<PagedResultDto<GetProductOutput>> GetProductByName(GetProductListInput input);
        Task<int> CreateProduct(CreateProductInput input);
        Task UpdateProduct(UpdateProductInput input);
        Task DeleteProduct(DeleteProductInput input);
        Task<GetProductOutput> GetProduct(GetProductInput input);

        Task CreateProductUnit(CreateProductUnitInput input);
        Task<PagedResultDto<GetProductUnitOutput>> GetProductUnits(GetProductUnitsInput input);
        Task UpdateProductUnit(UpdateProductUnitInput input);
        Task DeleteProductUnit(DeleteProductUnitInput input);
        Task<GetProductUnitOutput> GetProductUnit(GetProductUnitInput input);
    }
}
