using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.Roles.Dto;

namespace ezinvmvc.Roles
{
    public interface IRoleAppService : IAsyncCrudAppService<RoleDto, int, PagedRoleResultRequestDto, CreateRoleDto, RoleDto>
    {
        Task<ListResultDto<PermissionDto>> GetAllPermissions();

        Task<GetRoleForEditOutput> GetRoleForEdit(EntityDto input);

        Task<PagedResultDto<RoleListDto>> GetRolesAsync(GetRolesInput input);

        Task<PagedResultDto<RoleListDto>> GetRoles(GetRolesInput input);

    }
}
