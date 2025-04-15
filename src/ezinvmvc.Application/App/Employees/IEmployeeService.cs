using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Employees.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IEmployeeService : IApplicationService
    {
        Task<PagedResultDto<GetEmployeeOutput>> GetAllSalescordinator(GetEmployeeListInput input);
        Task<PagedResultDto<GetEmployeeOutput>> GetEmployees(GetEmployeeListInput input);
        Task<PagedResultDto<GetEmployeeOutput>> GetAttEmployees(GetEmployeeListInput input);
        Task<PagedResultDto<GetEmployeeOutput>> GetUsersNoEmployee(GetEmployeeListInput input);
        Task CreateEmployee(CreateEmployeeInput input);
        Task UpdateEmployee(UpdateEmployeeInput input);
        Task DeleteEmployee(DeleteEmployeeInput input);
        Task<GetEmployeeOutput> GetEmployee(GetEmployeeInput input);
        Task<PagedResultDto<GetEmployeeOutput>> GetAgents(GetEmployeeListInput input);

        Task<IEnumerable<GetEmployeeOutput>> GetAllEmployeeAsync();
        Task<PagedResultDto<GetEmployeeOutput>> GetAccountExecutives(GetEmployeeListInput input);
        Task<PagedResultDto<GetEmployeeOutput>> GetAllEmp(GetEmployeeListInput input);
        Task<PagedResultDto<GetEmployeeOutput>> GetAllAgentAccounts(GetEmployeeListInput input);
        Task<PagedResultDto<GetEmployeeOutput>> GetAllEmployeeMasterList(GetEmployeeListInput input);
        Task<PagedResultDto<GetEmployeeOutput>> GetAllRateMasterList(GetEmployeeListInput input);
    }
}
