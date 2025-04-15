using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public interface ILeadManager : IDomainService
    {
        Task<IEnumerable<Lead>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Lead>> GetAllListforRFQ(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Lead>> GetAllListforRFQforEdit(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Lead> GetByIdAsync(int id);
        Task<IEnumerable<Lead>> GetLeadDetailsByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Lead entity);
        Task<IdentityResult> UpdateAsync(Lead entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
