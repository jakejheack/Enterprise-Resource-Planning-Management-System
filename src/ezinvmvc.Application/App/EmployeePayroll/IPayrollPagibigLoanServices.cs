using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollPagibigLoanServices : IApplicationService
    {
        Task CreateAsync(CreatePayrollPagibigLoanInput input);
        Task UpdateAsync(UpdatePayrollPagibigLoanInput input);
        Task DeleteAsync(DeletePayrollPagibigLoanInput input);
        Task<PagedResultDto<GetPayrollPagibigLoanOutput>> GetAllListAsync(GetEmpPayrollListInput input);
        Task<GetPayrollPagibigLoanOutput> GetByIdAsync(GetEmpPayrollInput input);
    }
}