using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeesAllowance.Dto;
using ezinvmvc.App.EmployeesAllowance.Models;

namespace ezinvmvc.App.EmployeesAllowance
{
    public class EmployeeAllowanceService : ezinvmvcAppServiceBase, IEmployeeAllowanceService
    {
        private readonly IEmployeeAllowanceManager _Manager;

        public EmployeeAllowanceService(IEmployeeAllowanceManager employeeAllowanceManager)
        {
            _Manager = employeeAllowanceManager;
        }

        public async Task CreateEmployeeAllowance(CreateEmployeesAllowanceInput input)
        {
            EmployeeAllowances output = Mapper.Map<EmployeeAllowances>(input);

            CheckErrors(await _Manager.CreateEmployeeAllowancesAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAllowance(DeleteEmployeesAllowanceInput input)
        {
            CheckErrors(await _Manager.DeleteEmployeeAllowancesAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmployeesAllowanceOutput>> GetEmployeeAllowance(GetEmployeesAllowanceListInput input)
        {
            var resultList = await _Manager.GetAllEmployeeAllowancesAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeesAllowanceOutput>(listcount, ObjectMapper.Map<List<GetEmployeesAllowanceOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeesAllowanceOutput>> GetTop1EmployeeAllowance(GetEmployeesAllowanceInput input)
        {
            var resultList = await _Manager.GetAllTop1EmployeeAllowancesAsync(input.EmpId);
            int listcount = 0;
            return new PagedResultDto<GetEmployeesAllowanceOutput>(listcount, ObjectMapper.Map<List<GetEmployeesAllowanceOutput>>(resultList));
        }

        public async Task UpdateEmployeeAllowance(UpdateEmployeesAllowanceInput input)
        {
            EmployeeAllowances output = Mapper.Map<UpdateEmployeesAllowanceInput, EmployeeAllowances>(input);
            CheckErrors(await _Manager.UpdateEmployeeAllowancesAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<PagedResultDto<GetEmployeesAllowanceOutput>> UpdateEmployeeAllowancesStatus(UpdateEmployeesAllowanceInput input)
        {
            var resultList = await _Manager.UpdateEmployeeAllowancesByIdAsync(input.EmpId);
            int listcount = 0;
            return new PagedResultDto<GetEmployeesAllowanceOutput>(listcount, ObjectMapper.Map<List<GetEmployeesAllowanceOutput>>(resultList));

        }

        public async Task<PagedResultDto<GetEmployeesAllowanceOutput>> GetTop1EmpAllowanceAsync(GetEmployeesAllowanceInput input)
        {
            var resultList = await _Manager.GetTop1EmpAllowancesAsync(input.EmpId);
            int listcount = 0;
            return new PagedResultDto<GetEmployeesAllowanceOutput>(listcount, ObjectMapper.Map<List<GetEmployeesAllowanceOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeesAllowanceOutput>> GetNonTaxEmpAllowanceAsync(GetEmployeesAllowanceInput input)
        {
            var resultList = await _Manager.GetNonTaxEmpAllowancesAsync(input.EmpId);
            int listcount = 0;
            return new PagedResultDto<GetEmployeesAllowanceOutput>(listcount, ObjectMapper.Map<List<GetEmployeesAllowanceOutput>>(resultList));
        }

    }
}
