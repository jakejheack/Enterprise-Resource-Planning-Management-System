using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollAttAdjustmentServices : IApplicationService
    {
        Task CreateAsync(CreatePayrollAttAdjustmentInput input);
        Task UpdateAsync(UpdatePayrollAttAdjustmentInput input);
        Task DeleteAsync(DeletePayrollAttAdjustmentInput input);
        Task<PagedResultDto<GetPayrollAttAdjustmentOutput>> GetAllListAsync(GetEmpPayrollListInput input);
        Task<GetPayrollAttAdjustmentOutput> GetByIdAsync(GetEmpPayrollInput input);
    }
}
