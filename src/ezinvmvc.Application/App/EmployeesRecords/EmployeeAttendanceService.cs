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
    public class EmployeeAttendanceService : ezinvmvcAppServiceBase, IEmployeeAttendanceService
    {
        private readonly IEmployeeAttendanceManager _Manager;

        public EmployeeAttendanceService(IEmployeeAttendanceManager employeeAttendanceManager)
        {
            _Manager = employeeAttendanceManager;
        }

        public async Task CreateEmployeeAttendance(CreateEmployeeAttendance input)
        {
            EmployeeAttendance output = Mapper.Map<EmployeeAttendance>(input);

            CheckErrors(await _Manager.CreateEmployeeAttendanceAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAttendance(DeleteEmployeeAttendance input)
        {
            CheckErrors(await _Manager.DeleteEmployeeAttendancesAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmployeeAttendanceOutput>> GetEmployeeAttendance(GetEmployeeAttendanceListInput input)
        {
            var resultList = await _Manager.GetAllEmployeeAttendanceAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeAttendanceOutput>(listcount, ObjectMapper.Map<List<GetEmployeeAttendanceOutput>>(resultList));

        }

        public async Task UpdateEmployeeAttendance(UpdateEmployeeAttendance input)
        {
            EmployeeAttendance output = Mapper.Map<UpdateEmployeeAttendance, EmployeeAttendance>(input);
            CheckErrors(await _Manager.UpdateEmployeeAttendanceAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
