using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.Roles.Dto;
using ezinvmvc.Users.Dto;

namespace ezinvmvc.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>
    {
        Task<ListResultDto<RoleDto>> GetRoles();
        
        Task ChangeLanguage(ChangeUserLanguageDto input);
        //wilson
        //Task<IEnumerable<UserDto>> GetAll();
    }
}
