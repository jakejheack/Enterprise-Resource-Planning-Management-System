using Abp.Application.Services.Dto;
using ezinvmvc.App.BioAttendance.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public class AttRecordsService : ezinvmvcAppServiceBase, IAttRecordsService
    {
        private readonly IAttRecordsManager _attRecordsManager;

        public AttRecordsService(IAttRecordsManager attRecordsManager)
        {
            _attRecordsManager = attRecordsManager;
        } 
        public async Task<PagedResultDto<GetAttRecordsOutput>> GetAttRecordListAsync(GetAttRecordsListInput input)
        {
            var resultList = await _attRecordsManager.GetAttRecAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetAttRecordsOutput>(listcount, ObjectMapper.Map<List<GetAttRecordsOutput>>(resultList));

        }
    }
}
