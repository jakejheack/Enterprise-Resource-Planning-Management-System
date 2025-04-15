using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public interface ICollectionManager : IDomainService
    {
        Task<IEnumerable<Collection>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Collection> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Collection entity);
        Task<IdentityResult> UpdateAsync(Collection entity);
        Task<IdentityResult> DeleteAsync(int id);

    }
}
