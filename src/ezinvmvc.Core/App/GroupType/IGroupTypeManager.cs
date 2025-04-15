using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.GroupTypes
{
    public interface IGroupTypeManager : IDomainService
    {
        Task<IEnumerable<GroupType>> GetAllList(string filter, string sorting);

        Task<GroupType> GetByIdAsync(int id);

        Task<IdentityResult> CreateAsync(GroupType entity);

        Task<IdentityResult> UpdateAsync(GroupType entity);

        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<GroupType>> GetAll();
    }
}
