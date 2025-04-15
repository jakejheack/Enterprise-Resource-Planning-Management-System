using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.OvertimeRates.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.OvertimeRates
{
    public interface IOTRatesService : IApplicationService
    {
        Task CreateOTRateAsync(CreateOTRatesInput input);

        Task<GetOTRatesOutput> GetOTRateAsync(GetOvertimeRateInput input);

        Task DeleteOTRateAsync(DeleteOTRatesInput input);

        Task<PagedResultDto<GetOTRatesOutput>> GetAllOTRate();

        Task<PagedResultDto<GetOTRatesOutput>> GetPayrollOTListAsync(GetOTRateListInput input);

    }
}
