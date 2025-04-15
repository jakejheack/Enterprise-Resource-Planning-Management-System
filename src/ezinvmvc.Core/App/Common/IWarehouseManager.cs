using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IWarehouseManager : IDomainService
    {
        Task<IEnumerable<Warehouse>> GetAllList();
        Task<Warehouse> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Warehouse entity);
        Task<IdentityResult> UpdateAsync(Warehouse entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
