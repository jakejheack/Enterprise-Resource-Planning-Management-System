using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ezinvmvc.App.Common
{
    public interface IEntryTypeManager : IDomainService
    {
        Task<IEnumerable<EntryType>> GetAllList();
        Task<EntryType> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(EntryType entity);
        Task<IdentityResult> UpdateAsync(EntryType entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
