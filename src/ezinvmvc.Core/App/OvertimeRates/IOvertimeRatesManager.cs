using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.OvertimeRates
{
    public interface IOvertimeRatesManager : IDomainService
    {
        Task<IEnumerable<OvertimeRate>> GetAllOvertimeRatesAsync();

        Task<OvertimeRate> GetOvertimeRateByIdAsync(int id);

        Task<IdentityResult> CreateOvertimeRateAsync(OvertimeRate entity);

        Task<IdentityResult> UpdateOvertimeRateAsync(OvertimeRate entity);

        Task<IdentityResult> DeleteOvertimeRateAsync(int id);
    }
}
