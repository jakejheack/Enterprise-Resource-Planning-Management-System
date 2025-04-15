using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Products.Dto;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface IProductPriceService
    {
        Task CreateProductPrice(CreateProductPriceInput input);
        Task<PagedResultDto<GetProductPriceOutput>> GetProductPrices(GetProductPricesInput input);
        Task UpdateProductPrice(UpdateProductPriceInput input);
        Task DeleteProductPrice(DeleteProductPriceInput input);
        Task<GetProductPriceOutput> GetProductPrice(int id);
    }
}
