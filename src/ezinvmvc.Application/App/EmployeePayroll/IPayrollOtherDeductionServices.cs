using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollOtherDeductionServices : IApplicationService
    {
        Task CreateAsync(CreatePayrollOtherDeductionInput input);
        Task UpdateAsync(UpdatePayrollOtherDeductionInput input);
        Task DeleteAsync(DeletePayrollAllowanceAdjustmentInput input);
        Task<PagedResultDto<GetPayrollOtherDeductionOutput>> GetAllListAsync(GetEmpPayrollListInput input);
        Task<GetPayrollOtherDeductionOutput> GetByIdAsync(GetEmpPayrollInput input);
    }
}
