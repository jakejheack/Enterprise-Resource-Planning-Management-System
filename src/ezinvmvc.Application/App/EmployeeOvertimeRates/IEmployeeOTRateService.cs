using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeeOvertimeRates.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeeOvertimeRates
{
    public interface IEmployeeOTRateService : IApplicationService
    {
        Task CreateEmployeeOTRates(CreateEmployeeOTRatesInput input);

        Task<PagedResultDto<EmployeeOTRatesOutput>> GetEmployeeOTRatesAsync(GetEmployeeOTRatesListInput input);

        Task DeleteEmployeeOTRatesAsync(DeleteEmployeeOTRateInput input);
        
        Task<EmployeeOTRatesOutput> UpdateEmployeeOTRatesAsync(GetEmployeeOTRatesInput input);

        Task<EmployeeOTRatesOutput> GetTop1EmployeeOTRatesAsync(GetEmployeeOTRatesInput input);

    }
}
