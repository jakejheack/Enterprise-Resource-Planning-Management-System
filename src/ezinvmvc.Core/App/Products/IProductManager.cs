using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface IProductManager : IDomainService
    {
        Task<IEnumerable<Product>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Product> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Product entity);
        Task<IdentityResult> UpdateAsync(Product entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IEnumerable<Product>> GetByName(string name);

    }
}
