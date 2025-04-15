using Abp.Domain.Services;
using ezinvmvc.App.Addresses.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public interface ICityManager : IDomainService
    {
        Task<IEnumerable<City>> GetAllList();
        Task<City> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(City entity);
        Task<IdentityResult> UpdateAsync(City entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
