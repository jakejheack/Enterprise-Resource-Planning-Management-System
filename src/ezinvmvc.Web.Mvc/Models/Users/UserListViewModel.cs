using System.Collections.Generic;
using ezinvmvc.Roles.Dto;
using ezinvmvc.Users.Dto;

namespace ezinvmvc.Web.Models.Users
{
    public class UserListViewModel
    {
        public IReadOnlyList<UserDto> Users { get; set; }

        public IReadOnlyList<RoleDto> Roles { get; set; }
    }
}
