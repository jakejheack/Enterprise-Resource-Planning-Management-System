using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollOtherLoanServices : IApplicationService
    {
        Task CreateAsync(CreatePayrollOtherLoanInput input);
        Task UpdateAsync(UpdatePayrollOtherLoanInput input);
        Task DeleteAsync(DeletePayrollOtherLoanInput input);
        Task<PagedResultDto<GetPayrollOtherLoanOutput>> GetAllListAsync(GetEmpPayrollListInput input);
        Task<GetPayrollOtherLoanOutput> GetByIdAsync(GetEmpPayrollInput input);
    }
}
