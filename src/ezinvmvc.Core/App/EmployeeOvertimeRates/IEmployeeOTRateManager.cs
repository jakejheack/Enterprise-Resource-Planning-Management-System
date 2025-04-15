using ezinvmvc.App.EmployeeOvertimeRates.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeeOvertimeRates
{
    public interface IEmployeeOTRateManager
    {
        Task<EmployeeOTRates> GetTop1EmployeeOTRatesAsync(int empId);

        Task<IEnumerable<EmployeeOTRates>> GetAllEmployeeOTRatesAsync(string filter);
               
        Task<EmployeeOTRates> UpdateAllEmployeeOTRatesAsync(int empId);

        Task<IdentityResult> CreateEmployeeOTRatesAsync(EmployeeOTRates entity);

        Task<IdentityResult> UpdateEmployeeOTRatesAsync(EmployeeOTRates entity);

        Task<IdentityResult> DeleteEmployeeOTRatesAsync(int id);
    }
}
