using Abp.Application.Services;
using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Jobs
{
    public interface IJobsManager : IDomainService
    {
        Task<IdentityResult> CreateJobsAsync(Jobs entity);

        Task<IdentityResult> UpdateJobsAsync(Jobs entity);

        Task<IdentityResult> DeleteJobsAsync(int id);

        Task<Jobs> GetJobsByIdAsync(int id);

        Task<IEnumerable<Jobs>> UpdateJobsByIdAsync(int id);

        Task<IEnumerable<Jobs>> GetJobsAsync(string filter);
    }
}
