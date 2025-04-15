using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees.Exporting;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.Employees
{
    //[AbpAuthorize(PermissionNames.Master_Employees)]
    public class EmployeeService : ezinvmvcAppServiceBase, IEmployeeService
    {
        private readonly IEmployeeManager _Manager;

        public EmployeeService(IEmployeeManager EmployeeManager)
        {
            _Manager = EmployeeManager;
        }

        public async Task CreateEmployee(CreateEmployeeInput input)
        {
            Employee output = Mapper.Map<Employee>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployee(DeleteEmployeeInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetAgents(GetEmployeeListInput input)
        {
                var resultList = await _Manager.GetAgents(input.Filter);
            int listcount = 0;
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

        public async Task<IEnumerable<GetEmployeeOutput>> GetAllEmployeeAsync()
        {
            var getall = await _Manager.GetAllEmployeeAsync();
            return Mapper.Map<List<GetEmployeeOutput>>(getall);
        }

        public async Task<GetEmployeeOutput> GetEmployee(GetEmployeeInput input)
        {
            var getbyid = await _Manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetEmployeeOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetEmployees(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmployeeOutput>> GetAttEmployees(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetAllAttendanceList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetAllSalescordinator(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetAllSalescordinator(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetUsersNoEmployee(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetAllUserList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

        public async Task UpdateEmployee(UpdateEmployeeInput input)
        {
            Employee output = Mapper.Map<UpdateEmployeeInput, Employee>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetAccountExecutives(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetAccountExecutives(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetAllEmp(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetAll(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetAllAgentAccounts(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetAgentAccount(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetAllEmployeeMasterList(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetEmployeeMasterList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeOutput>> GetAllRateMasterList(GetEmployeeListInput input)
        {
            var resultList = await _Manager.GetRateMasterList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeOutput>(listcount, ObjectMapper.Map<List<GetEmployeeOutput>>(resultList));
        }

    }
}
