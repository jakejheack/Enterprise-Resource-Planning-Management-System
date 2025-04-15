using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Common.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public class HRTypeService : ezinvmvcAppServiceBase, IHRTypeService
    {
        private readonly IHrTypeManager _manager;

        public HRTypeService(IHrTypeManager manager)
        {
            _manager = manager;
        }


        public async Task<PagedResultDto<GetHRTypeOutput>> GetAllPeriodRateAsync()
        {
            var resultList = await _manager.GetAllPeriodTypeAsync();
            int listcount = 0;
            return new PagedResultDto<GetHRTypeOutput>(listcount, ObjectMapper.Map<List<GetHRTypeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetHRTypeOutput>> GetAllPeriodTypeAsync()
        {
            var resultList = await _manager.GetAllPeriodRateAsync();
            int listcount = 0;
            return new PagedResultDto<GetHRTypeOutput>(listcount, ObjectMapper.Map<List<GetHRTypeOutput>>(resultList));
        }
    }
}
