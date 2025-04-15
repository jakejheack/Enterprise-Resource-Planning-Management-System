using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IDocumentManager : IDomainService
    {
        Task<IEnumerable<Documents>> GetAllList();
        Task<IEnumerable<Documents>> GetAllListFiltered(int id, string reference, int referenceId, string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Documents> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Documents entity);
        Task<IdentityResult> UpdateAsync(Documents entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
