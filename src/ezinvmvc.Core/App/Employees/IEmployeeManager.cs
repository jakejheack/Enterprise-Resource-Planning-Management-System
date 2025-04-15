using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IEmployeeManager : IDomainService
    {
      
        Task<IEnumerable<Employee>> GetAllSalescordinator(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Employee>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Employee>> GetAllAttendanceList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Employee>> GetAllUserList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<Employee> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(Employee entity);
        Task<IdentityResult> UpdateAsync(Employee entity);
        Task<IdentityResult> DeleteAsync(int id);
        Task<IEnumerable<Employee>> GetAgents(string name);
        Task<IEnumerable<Employee>> GetAllEmployeeAsync();
        Task<IEnumerable<Employee>> GetAccountExecutives(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Employee>> GetAll(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Employee>> GetAgentAccount(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Employee>> GetEmployeeMasterList(string filter, string sorting, int offset, int fetch, bool forexport);
        Task<IEnumerable<Employee>> GetRateMasterList(string filter, string sorting, int offset, int fetch, bool forexport);


    }
}
