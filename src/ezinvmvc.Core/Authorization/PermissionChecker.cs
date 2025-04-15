using Abp.Authorization;
using ezinvmvc.Authorization.Roles;
using ezinvmvc.Authorization.Users;

namespace ezinvmvc.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
