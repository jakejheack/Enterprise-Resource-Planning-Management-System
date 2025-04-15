using Microsoft.AspNetCore.Mvc;
using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.Controllers;

namespace ezinvmvc.Web.Controllers
{
    [AbpMvcAuthorize]
    public class AboutController : ezinvmvcControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
	}
}
