using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
   public interface IOperationManager : IDomainService
    {
        Task<IEnumerable<Operation>> GetAllList();
        Task<Operation> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Operation entity);
        Task<IdentityResult> UpdateAsync(Operation entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
