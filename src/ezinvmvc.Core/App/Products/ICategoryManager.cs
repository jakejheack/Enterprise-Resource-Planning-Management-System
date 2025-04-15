using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface ICategoryManager : IDomainService
    {
        Task<IEnumerable<Category>> GetAllList();
        Task<Category> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Category entity);
        Task<IdentityResult> UpdateAsync(Category entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
