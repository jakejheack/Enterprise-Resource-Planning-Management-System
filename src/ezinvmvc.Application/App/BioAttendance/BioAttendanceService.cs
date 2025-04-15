using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.BioAttendance.Dto;
using ezinvmvc.App.BioAttendance.Models;

namespace ezinvmvc.App.BioAttendance
{
    public class BioAttendanceService : ezinvmvcAppServiceBase, IBioAttendanceService
    {
        private readonly IAttendanceManager _attendanceManager;

        public BioAttendanceService(IAttendanceManager attendanceManager)
        {
            _attendanceManager = attendanceManager;
        }

        public async Task<int> CreateAttendanceEntryAsync(CreateBioAttendanceInput input)
        {
            foreach (AttendanceItemInput item in input.attendanceitem)
            {
                Attendance attendance = Mapper.Map<Attendance>(item);
                try
                {
                    CheckErrors(await _attendanceManager.CreateAttendanceAsync(attendance));
                }
                catch (Exception ex)
                {

                }                
            }

            await CurrentUnitOfWork.SaveChangesAsync();
            return 1;
        }

        public async Task<PagedResultDto<GetAttendanceOutputFilter>> GetAllAttendanceAsync()
        {
            var resultList = await _attendanceManager.GetAttendanceAsync();
            int listcount = 0;
            return new PagedResultDto<GetAttendanceOutputFilter>(listcount, ObjectMapper.Map<List<GetAttendanceOutputFilter>>(resultList));
        }
                
        public async Task<PagedResultDto<GetAttendanceOutput>> GetAllAttendanceIdAsync(GetAttendanceListInput input)
        {
            var resultList = await _attendanceManager.GetAttendanceByIdAsync(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetAttendanceOutput>(listcount, ObjectMapper.Map<List<GetAttendanceOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetAttendanceOutput>> GetAllAttendanceByCodeAsync(GetAttendanceListInput input)
        {
            var resultList = await _attendanceManager.GetAttendanceByCodeAsync(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetAttendanceOutput>(listcount, ObjectMapper.Map<List<GetAttendanceOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetAttendanceOutput>> GetAttendance(GetAttendanceListInput input)
        {
            var resultList = await _attendanceManager.GetAttendance(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetAttendanceOutput>(listcount, ObjectMapper.Map<List<GetAttendanceOutput>>(resultList));
        }

        public async Task<GetAttendanceTopOutput> GetTop1AscOvertimeRateAsync(AttendanceInput input)
        {
            var getbyid = await _attendanceManager.GetTop1AttendanceAscAsync(input.AttendanceId);
            return Mapper.Map<GetAttendanceTopOutput>(getbyid);
        }

        public async Task<GetAttendanceTopOutput> GetTop1DescOvertimeRateAsync(AttendanceInput input)
        {
            var getbyid = await _attendanceManager.GetTop1AttendanceDescAsync(input.AttendanceId);
            return Mapper.Map<GetAttendanceTopOutput>(getbyid);
        }

        public async Task<GetAttendanceTopOutput> GetRestDayAsync(AttendanceInput input)
        {
            var getbyid = await _attendanceManager.GetRestdaycAsync(input.EmpId,input.Days);
            return Mapper.Map<GetAttendanceTopOutput>(getbyid);
        }
    }
}
