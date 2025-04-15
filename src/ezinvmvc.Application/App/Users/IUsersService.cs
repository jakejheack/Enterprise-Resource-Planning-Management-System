using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Users.Dto;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Users
{
    public interface IUsersService : IApplicationService
    {
        //Task<PagedResultDto<GetUsersOutput>>GetUsers(GetUsersListInput input);
        Task<GetUsersOutput>GetUser(GetUsersInput input);
        Task<IEnumerable<GetUsersOutput>>GetAllUsers(GetUsersListInput input);
    }
}
