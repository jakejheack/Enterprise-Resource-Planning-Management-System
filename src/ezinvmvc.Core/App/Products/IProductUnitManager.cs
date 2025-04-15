using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace ezinvmvc.App.Products
{
    public interface IProductUnitManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(ProductUnit entity);
        Task<IdentityResult> UpdateAsync(ProductUnit entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IEnumerable<ProductUnit>> GetAllList(int productid);
        Task<ProductUnit> GetByIdAsync(int id);
    }
}
