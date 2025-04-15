using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollSSSLoanServices : IApplicationService
    {
        Task CreateAsync(CreatePayrollSSSLoanInput input);
        Task UpdateAsync(UpdatePayrollSSSLoanInput input);
        Task DeleteAsync(DeletePayrollSSSLoanInput input);
        Task<PagedResultDto<GetPayrollSSSLoanOutput>> GetAllListAsync(GetEmpPayrollListInput input);
        Task<GetPayrollSSSLoanOutput> GetByIdAsync(GetEmpPayrollInput input);
        Task<PagedResultDto<GetPayrollSSSLoanOutput>> GetSSSLoanCollection(GetEmpPayrollListInput input);
    }
}