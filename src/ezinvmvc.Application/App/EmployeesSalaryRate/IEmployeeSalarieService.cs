using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesSalaryRate.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public interface IEmployeeSalarieService : IApplicationService
    {
        Task<PagedResultDto<GetEmployeeSalariesOutput>> GetEmployeeSalary(GetEmployeeSalariesListInput input);

        Task<PagedResultDto<GetEmployeeSalariesOutput>> GetTop1EmployeeSalary(GetEmployeeSalariesInput input);

        Task<PagedResultDto<GetEmployeeSalariesOutput>> GetTop1EmpSalary(GetEmployeeSalariesInput input);

        Task CreateEmployeeSalary(CreateEmployeeSalariesInput input);

        Task UpdateEmployeeSalary(UpdateEmployeeSalariesInput input);

        Task DeleteEmployeeSalary(DeleteEmployeeSalariesInput input);
    }
}
