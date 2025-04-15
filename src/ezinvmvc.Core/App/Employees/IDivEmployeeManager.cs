using Abp.Domain.Services;
using ezinvmvc.App.Employees.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IDivEmployeeManager : IDomainService
    {
        Task<IEnumerable<DivEmployee>> GetAllDivEmployeeList(string filter, string sorting);

        Task<DivEmployee> GetDivEmployeeByIdAsync(int id);

        Task<IdentityResult> CreateDivEmployeeAsync(DivEmployee entity);

        Task<IdentityResult> UpdateDivEmployeeAsync(DivEmployee entity);

        Task<IdentityResult> DeleteDivEmployeeAsync(int id);

        Task<IEnumerable<DivEmployee>> GetAllDivEmployee();
    }
}
