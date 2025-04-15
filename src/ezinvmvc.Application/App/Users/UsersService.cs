using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Users.Dto;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.Users
{
    [AbpAuthorize(PermissionNames.Master_Users)]
    public class UsersService : ezinvmvcAppServiceBase, IUsersService
    {
        private readonly IUsersManager _Manager;
        public UsersService(IUsersManager usersManager)
        {
            _Manager = usersManager;
        }

        public async Task<GetUsersOutput> GetUser(GetUsersInput input)
        {
            var getbyid = await _Manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetUsersOutput>(getbyid);
        }

        public async Task<IEnumerable<GetUsersOutput>> GetAllUsers(GetUsersListInput input)
        {
            var getall = await _Manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount);
            return Mapper.Map<List<GetUsersOutput>>(getall);
        }
    }
}
