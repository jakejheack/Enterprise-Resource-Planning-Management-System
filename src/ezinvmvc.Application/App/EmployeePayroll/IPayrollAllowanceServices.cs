using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollAllowanceServices : IApplicationService
    {
        Task CreateAsync(CreatePayrollAllowanceAdjustmentInput input);
        Task UpdateAsync(UpdatePayrollAllowanceAdjustmentInput input);
        Task DeleteAsync(DeletePayrollAllowanceAdjustmentInput input);
        Task<PagedResultDto<GetPayrollAllowanceAdjustmentOutput>> GetAllListAsync(GetEmpPayrollListInput input);
        Task<GetPayrollAllowanceAdjustmentOutput> GetByIdAsync(GetEmpPayrollInput input);
    }
}
