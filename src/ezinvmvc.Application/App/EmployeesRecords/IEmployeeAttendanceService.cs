using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesRecords.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public interface IEmployeeAttendanceService : IApplicationService
    {
        Task<PagedResultDto<GetEmployeeAttendanceOutput>> GetEmployeeAttendance(GetEmployeeAttendanceListInput input);
        Task CreateEmployeeAttendance(CreateEmployeeAttendance input);
        Task UpdateEmployeeAttendance(UpdateEmployeeAttendance input);
        Task DeleteEmployeeAttendance(DeleteEmployeeAttendance input);
    }
}
