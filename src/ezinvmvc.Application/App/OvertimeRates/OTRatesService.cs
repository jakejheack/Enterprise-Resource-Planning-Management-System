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
    public class OTRatesService : ezinvmvcAppServiceBase, IOTRatesService
    {
        private readonly IOTRatesManager _Manager;

        public OTRatesService(IOTRatesManager oTRatesManager)
        {
            _Manager = oTRatesManager;
        }

        public async Task CreateOTRateAsync(CreateOTRatesInput input)
        {
            OTRates output = Mapper.Map<OTRates>(input);

            CheckErrors(await _Manager.CreateOTRateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteOTRateAsync(DeleteOTRatesInput input)
        {
            CheckErrors(await _Manager.DeleteOTRateAsync(input.Id));
        }

        public async Task<GetOTRatesOutput> GetOTRateAsync(GetOvertimeRateInput input)
        {
            var getbyid = await _Manager.GetOTRateByIdAsync(input.Id);
            return Mapper.Map<GetOTRatesOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetOTRatesOutput>> GetAllOTRate()
        {
            var resultList = await _Manager.GetOTRatesAsync();
            int listcount = 0;
            return new PagedResultDto<GetOTRatesOutput>(listcount, ObjectMapper.Map<List<GetOTRatesOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetOTRatesOutput>> GetPayrollOTListAsync(GetOTRateListInput input)
        {
            var resultList = await _Manager.GetPayrollOTList(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetOTRatesOutput>(listcount, ObjectMapper.Map<List<GetOTRatesOutput>>(resultList));
        }

    }
}
