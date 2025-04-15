using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IDepartmentManager : IDomainService
    {
        Task<IEnumerable<Department>> GetAllDepartmentList(string filter, string sorting);

        Task<Department> GetDepartmentByIdAsync(int id);

        Task<IdentityResult> CreateDepartmentAsync(Department entity);

        Task<IdentityResult> UpdateDepartmentAsync(Department entity);

        Task<IdentityResult> DeleteDepartmentAsync(int id);

        Task<IEnumerable<Department>> GetAllDepartment();
    }
}
