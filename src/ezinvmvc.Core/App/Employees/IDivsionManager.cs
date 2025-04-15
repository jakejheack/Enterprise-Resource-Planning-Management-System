using Abp.Domain.Services;
using ezinvmvc.App.Employees.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IDivsionManager : IDomainService
    {
        Task<IEnumerable<Division>> GetAllDivisionList(string filter, string sorting);

        Task<Division> GetDivisionByIdAsync(int id);

        Task<IdentityResult> CreateDivisionAsync(Division entity);

        Task<IdentityResult> UpdateDivisionAsync(Division entity);

        Task<IdentityResult> DeleteDivisionAsync(int id);

        Task<IEnumerable<Division>> GetAllDivisions();
    }
}
