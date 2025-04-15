using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Common.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IAttAdjustmentService : IApplicationService
    {
        Task<PagedResultDto<GetAttAdjustmentOutput>> GetAllTypeAsync();
    }
}
