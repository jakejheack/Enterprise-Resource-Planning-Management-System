using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.OvertimeRates
{
    public interface ITimeSchedManager : IDomainService
    {
        Task<IdentityResult> CreateAsync(TimeSched entity);

        Task<TimeSched> GetByIdAsync(int id);

        Task<IdentityResult> DeleteAsync(int id);

        Task<IEnumerable<TimeSched>> GetAsync();
    }
}
