using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeesRecords.Dto;
using ezinvmvc.App.EmployeesRecords.Models;

namespace ezinvmvc.App.EmployeesRecords
{
    public class EmployeeLeaveService : ezinvmvcAppServiceBase, IEmployeeLeaveService
    {
        private readonly IEmployeeLeavesManager _Manager;

        public EmployeeLeaveService(IEmployeeLeavesManager employeeLeavesManager)
        {
            _Manager = employeeLeavesManager;
        }

        public async Task CreateEmployeeLeaveAsync(CreateEmployeeLeaves input)
        {
            EmployeeLeaves output = Mapper.Map<EmployeeLeaves>(input);

            CheckErrors(await _Manager.CreateEmployeeLeavesAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeLeave(DeleteEmployeeLeaves input)
        {
            CheckErrors(await _Manager.DeleteEmployeeLeavesAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmployeeLeaveOutput>> GetEmployeeLeaveAsync(GetEmployeeLeaveListInput input)
        {
            var resultList = await _Manager.GetAllEmployeeLeavesAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLeaveOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLeaveOutput>>(resultList));

        }

        public async Task UpdateEmployeeLeaveAsync(UpdateEmployeeLeave input)
        {
            EmployeeLeaves output = Mapper.Map<UpdateEmployeeLeave, EmployeeLeaves>(input);
            CheckErrors(await _Manager.UpdateEmployeeLeavesAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
