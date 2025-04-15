using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.OvertimeRates.Dto;

namespace ezinvmvc.App.OvertimeRates
{
    public class TimeSchedService : ezinvmvcAppServiceBase, ITimeSchedService
    {
        private readonly ITimeSchedManager _Manager;

        public TimeSchedService(ITimeSchedManager timeSchedManager)
        {
            _Manager = timeSchedManager;
        }

        public async Task CreateTimeSchedAsync(CreateTimeSchedInput input)
        {
            TimeSched output = Mapper.Map<TimeSched>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteTimeSchedAsync(DeleteTimeSchedInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetTimeSchedOutput>> GetAllTimeSchedAsync()
        {
            var resultList = await _Manager.GetAsync();
            int listcount = 0;
            return new PagedResultDto<GetTimeSchedOutput>(listcount, ObjectMapper.Map<List<GetTimeSchedOutput>>(resultList));
        }

        public async Task<GetTimeSchedOutput> GetTimeSchedAsync(GetOvertimeRateInput input)
        {
            var getbyid = await _Manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetTimeSchedOutput>(getbyid);
        }
    }
}
