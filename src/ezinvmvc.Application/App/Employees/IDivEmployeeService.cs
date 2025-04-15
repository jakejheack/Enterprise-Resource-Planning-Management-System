using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Employees.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IDivEmployeeService : IApplicationService
    {
        Task<PagedResultDto<GetDivEmployeeOutput>> GetDivEmployee(GetDivEmployeeListInput input);
        Task CreateDivEmployee(CreateDivEmployeeInput input);
        Task UpdateDivEmployee(UpdateDivEmployeeInput input);
        Task DeleteDivEmployee(DeleteDivEmployeeInput input);
        Task<IEnumerable<GetDivEmployeeOutput>> GetAllDivEmployees();
    }
}
