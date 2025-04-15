using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IEmpPayrollService : IApplicationService
    {
        Task CreateEmpPayrollAsync(CreateEmpPayrollInput input);

        Task DeleteEmpPayrollAsync(DeleteEmpPayrollInput input);

        Task<GetEmpPayrollOutput> UpdateEmpPayrollAsync(GetEmpPayrollInput input);

        Task<PagedResultDto<GetEmpPayrollOutput>> GetEmpPayrollAsync(GetEmpPayrollListInput input);


        Task<PagedResultDto<GetEmpPayrollOutput>> Get13thmonthAsync(GetEmpPayrollListInput input);
    }
}
