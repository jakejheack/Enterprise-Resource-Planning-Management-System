using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Employees.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IDivisionService : IApplicationService
    {
        Task<PagedResultDto<GetDivisionOutput>> GetDivision(GetDivisionListInput input);
        Task CreateDivision(CreateDivisionInput input);
        Task UpdateDivision(UpdateDivisionInput input);
        Task DeleteDivision(DeleteDivisionInput input);
        Task<IEnumerable<GetDivisionOutput>> GetAllDivisions();
    }
}
