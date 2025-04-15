using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeePayroll.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public interface IPayrollOTDetailsServices : IApplicationService
    {
        Task CreateAsync(CreatePayrollOTDetailsInput input);
        Task UpdateAsync(UpdatePayrollOTDetailsOutput input);
        Task DeleteAsync(DeletePayrollOTDetailsInput input);
        Task<PagedResultDto<GetPayrollOTDetailsOutput>> GetAllListAsync(GetEmpPayrollListInput input);
        Task<GetPayrollOTDetailsOutput> GetByIdAsync(GetEmpPayrollInput input);
    }
}
