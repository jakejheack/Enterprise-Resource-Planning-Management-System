using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
   public interface IProductPriceManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(ProductPrice entity);
        Task<IdentityResult> UpdateAsync(ProductPrice entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IEnumerable<ProductPrice>> GetAllList(int productid, int pricingtypeid, int unitid);
        Task<ProductPrice> GetByIdAsync(int id);
    }
}
