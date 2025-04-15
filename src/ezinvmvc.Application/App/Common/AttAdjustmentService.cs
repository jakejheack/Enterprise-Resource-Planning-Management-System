using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Common.Dto;

namespace ezinvmvc.App.Common
{
    public class AttAdjustmentService : ezinvmvcAppServiceBase, IAttAdjustmentService
    {
        private readonly IAttAdjustmentManager _manager;

        public AttAdjustmentService(IAttAdjustmentManager manager)
        {
            _manager = manager;
        }

        public async Task<PagedResultDto<GetAttAdjustmentOutput>> GetAllTypeAsync()
        {
            var resultList = await _manager.GetAllListAsync();
            int listcount = 0;
            return new PagedResultDto<GetAttAdjustmentOutput>(listcount, ObjectMapper.Map<List<GetAttAdjustmentOutput>>(resultList));
        }
    }
}
