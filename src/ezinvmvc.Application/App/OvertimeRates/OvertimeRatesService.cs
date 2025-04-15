using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.OvertimeRates.Dto;

namespace ezinvmvc.App.OvertimeRates
{
    public class OvertimeRatesService : ezinvmvcAppServiceBase, IOvertimeRatesService
    {
        private readonly IOvertimeRatesManager _Manager;

        public OvertimeRatesService(IOvertimeRatesManager overtimeRatesManager)
        {
            _Manager = overtimeRatesManager;
        }

        public async Task CreateOvertimeRate(CreateOvertimeRatesInput input)
        {
            OvertimeRate output = Mapper.Map<OvertimeRate>(input);

            CheckErrors(await _Manager.CreateOvertimeRateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteOvertimeRate(DeleteOvertimeRatesInput input)
        {
            CheckErrors(await _Manager.DeleteOvertimeRateAsync(input.Id));
        }

        public async Task<PagedResultDto<GetOvertimeRatesOutput>> GetOvertimeRate()
        {
            var resultList = await _Manager.GetAllOvertimeRatesAsync();
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetOvertimeRatesOutput>(listcount, ObjectMapper.Map<List<GetOvertimeRatesOutput>>(resultList));

        }

        public async Task<GetOvertimeRatesOutput> GetTop1OvertimeRate(GetOvertimeRateInput input)
        {
            var getbyid = await _Manager.GetOvertimeRateByIdAsync(input.Id);
            return Mapper.Map<GetOvertimeRatesOutput>(getbyid);
        }

        public async Task UpdateOvertimeRate(UpdateOvertimeRatesInput input)
        {
            OvertimeRate output = Mapper.Map<UpdateOvertimeRatesInput, OvertimeRate>(input);
            CheckErrors(await _Manager.UpdateOvertimeRateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
