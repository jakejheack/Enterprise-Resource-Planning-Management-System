using Abp.Domain.Services;
using ezinvmvc.App.Addresses.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public interface IProvinceManager : IDomainService
    {
        Task<IEnumerable<Province>> GetAllList();
        Task<IEnumerable<City>> GetCities(int id);
        Task<Province> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Province entity);
        Task<IdentityResult> UpdateAsync(Province entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
