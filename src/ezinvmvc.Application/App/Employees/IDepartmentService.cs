using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Employees.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IDepartmentService : IApplicationService
    {
        Task<PagedResultDto<GetDepartmentOutput>> GetDepartments(GetDepartmentListInput input);
        Task CreateGroupType(CreateDepartmentInput input);
        Task UpdateGroupType(UpdateDepartmentInput input);
        Task DeleteGroupType(DeleteDepartmentInput input);
        Task<IEnumerable<GetDepartmentOutput>> GetAllDepartment();
    }
}
