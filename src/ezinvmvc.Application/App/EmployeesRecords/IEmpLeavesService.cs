using Abp.Application.Services.Dto;
using Abp.Domain.Services;
using ezinvmvc.App.EmployeesRecords.Dto;
using ezinvmvc.App.EmployeesSalaryRate;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public interface IEmpLeavesService : IDomainService
    {
        Task CreateAsync(CreateEmpLeaves input);

        Task<PagedResultDto<GetEmpLeavesOutput>> GetAll(GetEmpLeavesList input);

        Task DeleteAsync(GetEmpLeavesInput input);

        Task<GetEmpLeavesOutput> UpdateAsync(GetEmpLeavesInput input);

        Task<PagedResultDto<GetEmpLeavesOutput>> GetSickLeaveAsync(GetEmpLeavesList input);

        Task<PagedResultDto<GetEmpLeavesOutput>> GetVLeaveAsync(GetEmpLeavesList input);

        Task<PagedResultDto<GetEmpLeavesOutput>> GetAlleaveAsync(GetEmpLeavesList input);

        Task<PagedResultDto<GetEmpLeavesOutput>> GetPLeaveAsync(GetEmpLeavesList input);

        Task<PagedResultDto<GetEmpLeavesOutput>> GetILeaveAsync(GetEmpLeavesList input);
    }
}
