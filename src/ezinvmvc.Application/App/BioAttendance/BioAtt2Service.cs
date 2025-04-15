using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.BioAttendance.Dto;
using ezinvmvc.App.BioAttendance.Models;

namespace ezinvmvc.App.BioAttendance
{
    public class BioAtt2Service : ezinvmvcAppServiceBase, IBioAtt2Service
    {
        private readonly IAttendance2Manager _attendance2Manager;
        private readonly IAttendance3Manager _attendance3Manager;

        public BioAtt2Service(IAttendance2Manager attendance2Manager, IAttendance3Manager attendance3Manager)
        {
            _attendance2Manager = attendance2Manager;
            _attendance3Manager = attendance3Manager;
        }

        public async Task<int> CreateAtt2Async(CreateBioAttendance2Input input)
        {
            foreach (CreateAtt2Input item in input.att2item)
            {
                Attendance2 attendance2 = Mapper.Map<Attendance2>(item);
                try
                {
                    CheckErrors(await _attendance2Manager.CreateAsync(attendance2));
                }
                catch (Exception ex)
                {

                }
            }
            foreach (CreateAtt2Input item in input.att2item)
            {
                Attendance3 attendance3 = Mapper.Map<Attendance3>(item);
                try
                {
                    CheckErrors(await _attendance3Manager.CreateAsync(attendance3));
                }
                catch (Exception ex)
                {

                }
            }

            await CurrentUnitOfWork.SaveChangesAsync();
            return 1;
        }
        public async Task<PagedResultDto<GetAttendanceOutputFilter>> GetAllAtt2Async(GetAtt2ListInput input)
        {
            var resultList = await _attendance2Manager.GetAttendanceAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetAttendanceOutputFilter>(listcount, ObjectMapper.Map<List<GetAttendanceOutputFilter>>(resultList));
        }

        public async Task<PagedResultDto<GetAttendanceOutputFilter>> GetAllAttAsync()
        {
            var resultList = await _attendance2Manager.GetAttIdAsync();
            int listcount = 0;
            return new PagedResultDto<GetAttendanceOutputFilter>(listcount, ObjectMapper.Map<List<GetAttendanceOutputFilter>>(resultList));
        }

        public async Task<PagedResultDto<GetAtt2Output>> GetAllAttendanceIdAsync(GetAtt2ListInput input)
        {
            var resultList = await _attendance2Manager.GetAttendanceByIdAsync(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetAtt2Output>(listcount, ObjectMapper.Map<List<GetAtt2Output>>(resultList));
        }

        public async Task DeleteAtt2(DeleteAtt2Input input)
        {
            CheckErrors(await _attendance2Manager.DeleteAsync(input.Id));
        }

        public async Task UpdateAtt2(UpdateAtt2Input input)
        {
            Attendance2 output = Mapper.Map<UpdateAtt2Input, Attendance2>(input);
            CheckErrors(await _attendance2Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        //Adjustment Form//

        public async Task<PagedResultDto<GetAtt2Output>> GetAttByAttIdandCompnameAsync(GetAtt2ListInput input)
        {
            var resultList = await _attendance2Manager.GetAttendanceByAttIdandCompname(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetAtt2Output>(listcount, ObjectMapper.Map<List<GetAtt2Output>>(resultList));
        }

        public async Task<PagedResultDto<GetAtt2Output>> GetAttByNoAsync(GetAtt2ListInput input)
        {
            var resultList = await _attendance2Manager.GetAttendanceByNo(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetAtt2Output>(listcount, ObjectMapper.Map<List<GetAtt2Output>>(resultList));
        }

        public async Task CreateAdjAsync(CreateAtt2Input input)
        {
            Attendance2 output = Mapper.Map<Attendance2>(input);

            CheckErrors(await _attendance2Manager.CreateTime(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<PagedResultDto<GetAtt2Output>> GetAttAdjustmentReportAsync(GetAtt2ListInput input)
        {
            var resultList = await _attendance2Manager.GetAttAdjReport(input.Filter, input.Sorting);
            int listcount = 0;
            return new PagedResultDto<GetAtt2Output>(listcount, ObjectMapper.Map<List<GetAtt2Output>>(resultList));
        }

        public async Task<PagedResultDto<GetAtt2Output>> GetAttRecordAsync(GetAtt2ListInput input)
        {
            var resultList = await _attendance2Manager.GetAttendanceRecordAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetAtt2Output>(listcount, ObjectMapper.Map<List<GetAtt2Output>>(resultList));

        }

        public async Task<GetAtt2Output> GetByIdAsync(AttendanceInput input)
        {
            var getbyid = await _attendance2Manager.GetAttIdDataAsync(input.AttendanceId);
            return Mapper.Map<GetAtt2Output>(getbyid);
        }

        public async Task<PagedResultDto<GetAtt2Output>> GetAttRecordListAsync(GetAttRecordsListInput input)
        {
            var resultList = await _attendance2Manager.GetAttRecAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetAtt2Output>(listcount, ObjectMapper.Map<List<GetAtt2Output>>(resultList));
        }
        public async Task<PagedResultDto<GetAttendanceOutputFilter>> GetAttListAsync()
        {
            var resultList = await _attendance2Manager.GetAttAsync();
            int listcount = 0;
            return new PagedResultDto<GetAttendanceOutputFilter>(listcount, ObjectMapper.Map<List<GetAttendanceOutputFilter>>(resultList));
        }

    }
}
