using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.OvertimeRates
{
    public interface IOTRatesManager : IDomainService
    {
        Task<IdentityResult> CreateOTRateAsync(OTRates entity);

        Task<OTRates> GetOTRateByIdAsync(int id);

        Task<IdentityResult> DeleteOTRateAsync(int id);

        Task<IEnumerable<OTRates>> GetOTRatesAsync();

        Task<IEnumerable<OTRates>> GetPayrollOTList(string filter, string sorting);

    }
}
