using Abp.Domain.Services;
using ezinvmvc.App.Addresses.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public interface IAddressManager : IDomainService
    {
        Task<IEnumerable<Address>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Address> GetByIdAsync(int id);
        Task<Address> GetByReferenceIdAsync(int id, string reference);
        Task<IdentityResult> CreateAsync(Address entity);
        Task<IdentityResult> UpdateAsync(Address entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
