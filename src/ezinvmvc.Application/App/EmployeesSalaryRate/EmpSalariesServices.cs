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
    public class EmpSalariesServices : ezinvmvcAppServiceBase, IEmpSalariesServices
    {
        private readonly IEmpSalariesManager _Manager;

        public EmpSalariesServices(IEmpSalariesManager empSalariesManage)
        {
            _Manager = empSalariesManage;
        }

        public async Task CreateEmployeeSalaryAsync(CreateEmpSalariesInput input)
        {
            EmpSalaries output = Mapper.Map<EmpSalaries>(input);

            CheckErrors(await _Manager.CreateEmpSalariesAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeSalaryAsync(DeleteEmpSalariesInput input)
        {
            CheckErrors(await _Manager.DeleteEmpSalariesAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmpSalariesOutput>> GetEmpSalaryAsync(GetEmployeeSalariesListInput input)
        {
            var resultList = await _Manager.GetEmpSalariesAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpSalariesOutput>(listcount, ObjectMapper.Map<List<GetEmpSalariesOutput>>(resultList));
        }

        public async Task<GetEmpSalariesOutput> GetEmpSalariesByEmpIdAsync(GetEmpSalariesInput input)
        {
            var getbyid = await _Manager.GetEmpSalariesByIdAsync(input.Id);
            return Mapper.Map<GetEmpSalariesOutput>(getbyid);
        }

        public async Task UpdateEmployeeSalaryAsync(UpdateEmpSalariesInput input)
        {
            EmpSalaries output = Mapper.Map<UpdateEmpSalariesInput, EmpSalaries>(input);
            CheckErrors(await _Manager.UpdateEmpSalariesAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<GetEmpSalariesOutput> GetSalariesIdAsync(GetEmpSalariesInput input)
        {
            var getbyid = await _Manager.GetEmpSalIdAsync(input.Id);
            return Mapper.Map<GetEmpSalariesOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetEmpSalariesOutput>> GetOTSalaryListAsync(GetEmployeeSalariesListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetOtListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpSalariesOutput>(listcount, ObjectMapper.Map<List<GetEmpSalariesOutput>>(resultList));
        }
    }
}
