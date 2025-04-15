using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Pages_General_Ledger)]
    public class GeneralLedgerController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}