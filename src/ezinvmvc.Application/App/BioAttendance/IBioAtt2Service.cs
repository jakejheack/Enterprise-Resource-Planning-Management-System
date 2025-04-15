using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.BioAttendance.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public interface IBioAtt2Service : IApplicationService
    {
        Task<int> CreateAtt2Async(CreateBioAttendance2Input input);

        Task<PagedResultDto<GetAttendanceOutputFilter>> GetAllAtt2Async(GetAtt2ListInput input);

        Task<PagedResultDto<GetAttendanceOutputFilter>> GetAllAttAsync();

        Task<PagedResultDto<GetAtt2Output>> GetAllAttendanceIdAsync(GetAtt2ListInput input);

        Task UpdateAtt2(UpdateAtt2Input input);

        Task DeleteAtt2(DeleteAtt2Input input);

        //Adjustment Form//

        Task<PagedResultDto<GetAtt2Output>> GetAttByAttIdandCompnameAsync(GetAtt2ListInput input);

        Task<PagedResultDto<GetAtt2Output>> GetAttByNoAsync(GetAtt2ListInput input);

        Task CreateAdjAsync(CreateAtt2Input input);

        Task<PagedResultDto<GetAtt2Output>> GetAttAdjustmentReportAsync(GetAtt2ListInput input);

        Task<PagedResultDto<GetAtt2Output>> GetAttRecordAsync(GetAtt2ListInput input);

        Task<GetAtt2Output> GetByIdAsync(AttendanceInput input);

        Task<PagedResultDto<GetAtt2Output>> GetAttRecordListAsync(GetAttRecordsListInput input);

        Task<PagedResultDto<GetAttendanceOutputFilter>> GetAttListAsync();
    }
}
