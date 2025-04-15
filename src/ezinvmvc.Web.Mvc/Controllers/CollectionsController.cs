using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Pages_Collections)]
    public class CollectionsController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
        public async Task<ActionResult> Create()
        {
            return View();
        }
        public async Task<ActionResult> Edit(int id)
        {
            ViewBag.Id = id;
            return View();
        }
        public async Task<ActionResult> Details(int id)
        {
            ViewBag.Id = id;
            return View();
        }
    }
}