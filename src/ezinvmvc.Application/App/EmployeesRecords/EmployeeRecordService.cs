using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeesAccountsAbility.Dto;
using ezinvmvc.App.EmployeesRecords.Dto;
using ezinvmvc.App.EmployeesRecords.Models;

namespace ezinvmvc.App.EmployeesRecords
{
    public class EmployeeRecordService : ezinvmvcAppServiceBase, IEmployeeRecordService
    {
        private readonly IEmployeeRecordsManager _Manager;

        public EmployeeRecordService(IEmployeeRecordsManager employeeRecordManager)
        {
            _Manager = employeeRecordManager;
        }

        public async Task CreateEmployeeRecord(CreateEmployeeRecords input)
        {
            EmployeeRecords output = Mapper.Map<EmployeeRecords>(input);

            CheckErrors(await _Manager.CreateEmployeesRecordsAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeRecord(DeleteEmployeeRecords input)
        {
            CheckErrors(await _Manager.DeleteEmployeesRecordsAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmployeeRecordOutput>> GetAccountsAbility(GetEmployeeRecordListInput input)
        {
            var resultList = await _Manager.GetAllEmployeesRecordsAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeRecordOutput>(listcount, ObjectMapper.Map<List<GetEmployeeRecordOutput>>(resultList));
        }

        public async Task UpdateEmployeeRecord(UpdateEmployeeRecords input)
        {
            EmployeeRecords output = Mapper.Map<UpdateEmployeeRecords, EmployeeRecords>(input);
            CheckErrors(await _Manager.UpdateEmployeesRecordsAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
