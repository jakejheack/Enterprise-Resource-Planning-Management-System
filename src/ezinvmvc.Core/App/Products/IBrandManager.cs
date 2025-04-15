using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Products
{
    public interface IBrandManager : IDomainService
    {
        Task<IEnumerable<Brand>> GetAllList();
        Task<Brand> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Brand entity);
        Task<IdentityResult> UpdateAsync(Brand entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
