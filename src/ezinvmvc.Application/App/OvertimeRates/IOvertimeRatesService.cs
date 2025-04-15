using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.OvertimeRates.Dto;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.OvertimeRates
{
    public interface IOvertimeRatesService : IApplicationService
    {
        Task<PagedResultDto<GetOvertimeRatesOutput>> GetOvertimeRate();

        Task<GetOvertimeRatesOutput> GetTop1OvertimeRate(GetOvertimeRateInput input);

        Task CreateOvertimeRate(CreateOvertimeRatesInput input);

        Task UpdateOvertimeRate(UpdateOvertimeRatesInput input);

        Task DeleteOvertimeRate(DeleteOvertimeRatesInput input);
    }
}
