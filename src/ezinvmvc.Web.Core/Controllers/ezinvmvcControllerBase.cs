using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.Controllers
{
    public abstract class ezinvmvcControllerBase: AbpController
    {
        protected ezinvmvcControllerBase()
        {
            LocalizationSourceName = ezinvmvcConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
