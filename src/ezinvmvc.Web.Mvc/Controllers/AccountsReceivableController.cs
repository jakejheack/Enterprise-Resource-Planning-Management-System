using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;


namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Pages_Accounts_Receivable)]
    public class AccountsReceivableController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}