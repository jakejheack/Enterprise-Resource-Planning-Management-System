using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeesRecords.Dto;
using ezinvmvc.App.EmployeesSalaryRate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public class EmpLeavesService : ezinvmvcAppServiceBase, IEmpLeavesService
    {
        private readonly IEmpLeavesManager _Manager;

        public EmpLeavesService(IEmpLeavesManager Manager)
        {
            _Manager = Manager;
        }

        public async Task CreateAsync(CreateEmpLeaves input)
        {
            EmpLeaves output = Mapper.Map<EmpLeaves>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(GetEmpLeavesInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmpLeavesOutput>> GetAll(GetEmpLeavesList input)
        {
            var resultList = await _Manager.GetAllAsync(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetEmpLeavesOutput>(listcount, ObjectMapper.Map<List<GetEmpLeavesOutput>>(resultList));
        }

        public Task<GetEmpLeavesOutput> UpdateAsync(GetEmpLeavesInput input)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedResultDto<GetEmpLeavesOutput>> GetAlleaveAsync(GetEmpLeavesList input)
        {
            var resultList = await _Manager.GetAllAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpLeavesOutput>(listcount, ObjectMapper.Map<List<GetEmpLeavesOutput>>(resultList));
        }
        
        public async Task<PagedResultDto<GetEmpLeavesOutput>> GetSickLeaveAsync(GetEmpLeavesList input)
        {
            var resultList = await _Manager.GetSickLeaveAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpLeavesOutput>(listcount, ObjectMapper.Map<List<GetEmpLeavesOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmpLeavesOutput>> GetVLeaveAsync(GetEmpLeavesList input)
        {
            var resultList = await _Manager.GetVacationLeaveAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpLeavesOutput>(listcount, ObjectMapper.Map<List<GetEmpLeavesOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmpLeavesOutput>> GetPLeaveAsync(GetEmpLeavesList input)
        {
            var resultList = await _Manager.GetPaternityLeaveAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpLeavesOutput>(listcount, ObjectMapper.Map<List<GetEmpLeavesOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmpLeavesOutput>> GetILeaveAsync(GetEmpLeavesList input)
        {
            var resultList = await _Manager.GetIncentiveLeaveAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpLeavesOutput>(listcount, ObjectMapper.Map<List<GetEmpLeavesOutput>>(resultList));
        }
    }
}
