using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesSalaryRate.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public interface IEmpSalariesServices : IApplicationService
    {
        Task CreateEmployeeSalaryAsync(CreateEmpSalariesInput input);

        Task UpdateEmployeeSalaryAsync(UpdateEmpSalariesInput input);

        Task DeleteEmployeeSalaryAsync(DeleteEmpSalariesInput input);

        Task<GetEmpSalariesOutput> GetEmpSalariesByEmpIdAsync(GetEmpSalariesInput input);

        Task<PagedResultDto<GetEmpSalariesOutput>> GetEmpSalaryAsync(GetEmployeeSalariesListInput input);

        Task<GetEmpSalariesOutput> GetSalariesIdAsync(GetEmpSalariesInput input);

        Task<PagedResultDto<GetEmpSalariesOutput>> GetOTSalaryListAsync(GetEmployeeSalariesListInput input);
    }
}
