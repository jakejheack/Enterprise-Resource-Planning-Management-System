using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesRecords.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public interface IEmployeeLeaveService : IApplicationService
    {
        Task<PagedResultDto<GetEmployeeLeaveOutput>> GetEmployeeLeaveAsync(GetEmployeeLeaveListInput input);
        Task CreateEmployeeLeaveAsync(CreateEmployeeLeaves input);
        Task UpdateEmployeeLeaveAsync(UpdateEmployeeLeave input);
        Task DeleteEmployeeLeave(DeleteEmployeeLeaves input);
    }
}
