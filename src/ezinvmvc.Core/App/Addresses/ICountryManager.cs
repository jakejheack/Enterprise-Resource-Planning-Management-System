using Abp.Domain.Services;
using ezinvmvc.App.Addresses.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public interface ICountryManager : IDomainService
    {
        Task<IEnumerable<Country>> GetAllList();
        Task<IEnumerable<Province>> GetProvinces(int id);
        Task<Country> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Country entity);
        Task<IdentityResult> UpdateAsync(Country entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
