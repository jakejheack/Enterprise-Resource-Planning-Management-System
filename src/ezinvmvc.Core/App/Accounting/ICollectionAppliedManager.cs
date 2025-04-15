using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public interface ICollectionAppliedManager : IDomainService
    {
        Task<IEnumerable<CollectionApplied>> GetAllByParentId(int parentid);
        Task<CollectionApplied> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(CollectionApplied entity);
        Task<IdentityResult> UpdateAsync(CollectionApplied entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
