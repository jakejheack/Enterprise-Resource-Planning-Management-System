using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.OvertimeRates.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.OvertimeRates
{
    public interface ITimeSchedService : IApplicationService
    {
        Task CreateTimeSchedAsync(CreateTimeSchedInput input);

        Task<GetTimeSchedOutput> GetTimeSchedAsync(GetOvertimeRateInput input);

        Task DeleteTimeSchedAsync(DeleteTimeSchedInput input);

        Task<PagedResultDto<GetTimeSchedOutput>> GetAllTimeSchedAsync();
    }
}
