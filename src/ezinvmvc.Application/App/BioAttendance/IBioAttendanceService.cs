using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.BioAttendance.Dto;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance
{
    public interface IBioAttendanceService : IApplicationService
    {
        Task<int> CreateAttendanceEntryAsync(CreateBioAttendanceInput input);

        Task<PagedResultDto<GetAttendanceOutputFilter>> GetAllAttendanceAsync();

        Task<PagedResultDto<GetAttendanceOutput>> GetAllAttendanceIdAsync(GetAttendanceListInput input);

        Task<PagedResultDto<GetAttendanceOutput>> GetAllAttendanceByCodeAsync(GetAttendanceListInput input);

        Task<PagedResultDto<GetAttendanceOutput>> GetAttendance(GetAttendanceListInput input);
        
        Task<GetAttendanceTopOutput> GetTop1AscOvertimeRateAsync(AttendanceInput input);

        Task<GetAttendanceTopOutput> GetTop1DescOvertimeRateAsync(AttendanceInput input);

        Task<GetAttendanceTopOutput> GetRestDayAsync(AttendanceInput input);

    }
}
