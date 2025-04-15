using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeesSalaryRate.Dto;
using ezinvmvc.App.EmployeesSalaryRate.Models;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public class EmployeeSalariesService : ezinvmvcAppServiceBase, IEmployeeSalarieService
    {
        private readonly IEmployeeSalariesManager _Manager;

        public EmployeeSalariesService(IEmployeeSalariesManager employeeSalariesManager)
        {
            _Manager = employeeSalariesManager;
        }

        public async Task CreateEmployeeSalary(CreateEmployeeSalariesInput input)
        {
            EmployeeSalaries output = Mapper.Map<EmployeeSalaries>(input);

            CheckErrors(await _Manager.CreateEmployeeSalariesAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeSalary(DeleteEmployeeSalariesInput input)
        {
            CheckErrors(await _Manager.DeleteEmployeeSalariesAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmployeeSalariesOutput>> GetEmployeeSalary(GetEmployeeSalariesListInput input)
        {
            var resultList = await _Manager.GetAllEmployeeSalariesAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeSalariesOutput>(listcount, ObjectMapper.Map<List<GetEmployeeSalariesOutput>>(resultList));

        }

        public async Task<PagedResultDto<GetEmployeeSalariesOutput>> GetTop1EmployeeSalary(GetEmployeeSalariesInput input)
        {
            var resultList = await _Manager.GetAllTop1EmployeeSalariesAsync(input.EmpId);
            int listcount = 0;
            return new PagedResultDto<GetEmployeeSalariesOutput>(listcount, ObjectMapper.Map<List<GetEmployeeSalariesOutput>>(resultList));

            //var resultList = await _Manager.GetAllTop1EmployeeSalariesAsync(EmpId);
            //int listcount = 0;
            //if (resultList.Count() > 0)
            //{
            //    listcount = resultList.First().TotalRows;
            //}
            //return new PagedResultDto<GetEmployeeSalariesOutput>(listcount, ObjectMapper.Map<List<GetEmployeeSalariesOutput>>(resultList));

        }

        public async Task<PagedResultDto<GetEmployeeSalariesOutput>> GetTop1EmpSalary(GetEmployeeSalariesInput input)
        {
            var resultList = await _Manager.GetTop1EmpSalariesAsync(input.EmpId);
            int listcount = 0;
            return new PagedResultDto<GetEmployeeSalariesOutput>(listcount, ObjectMapper.Map<List<GetEmployeeSalariesOutput>>(resultList));
       }
        public async Task UpdateEmployeeSalary(UpdateEmployeeSalariesInput input)
        {
            EmployeeSalaries output = Mapper.Map<UpdateEmployeeSalariesInput, EmployeeSalaries>(input);
            CheckErrors(await _Manager.UpdateEmployeeSalariesAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
