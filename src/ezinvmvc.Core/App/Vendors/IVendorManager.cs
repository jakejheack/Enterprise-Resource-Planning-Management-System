using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Vendors
{
    public interface IVendorManager : IDomainService
    {
        Task<IEnumerable<Vendor>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Vendor> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Vendor entity);
        Task<IdentityResult> UpdateAsync(Vendor entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
