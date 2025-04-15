using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesAllowance.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesAllowance
{
    public interface IEmployeeAllowanceService : IApplicationService
    {
        Task<PagedResultDto<GetEmployeesAllowanceOutput>> GetEmployeeAllowance(GetEmployeesAllowanceListInput input);

        Task<PagedResultDto<GetEmployeesAllowanceOutput>> GetTop1EmployeeAllowance(GetEmployeesAllowanceInput input);

        Task<PagedResultDto<GetEmployeesAllowanceOutput>> GetTop1EmpAllowanceAsync(GetEmployeesAllowanceInput input);

        Task<PagedResultDto<GetEmployeesAllowanceOutput>> GetNonTaxEmpAllowanceAsync(GetEmployeesAllowanceInput input);        

        Task<PagedResultDto<GetEmployeesAllowanceOutput>> UpdateEmployeeAllowancesStatus(UpdateEmployeesAllowanceInput input);

        Task CreateEmployeeAllowance(CreateEmployeesAllowanceInput input);

        Task UpdateEmployeeAllowance(UpdateEmployeesAllowanceInput input);

        Task DeleteEmployeeAllowance(DeleteEmployeesAllowanceInput input);
    }
}
