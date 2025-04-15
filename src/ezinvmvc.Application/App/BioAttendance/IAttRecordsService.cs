using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.BioAttendance.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public interface IAttRecordsService : IApplicationService
    {
        Task<PagedResultDto<GetAttRecordsOutput>> GetAttRecordListAsync(GetAttRecordsListInput input);
    }
}
