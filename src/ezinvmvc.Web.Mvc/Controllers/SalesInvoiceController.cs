using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Pages_Sales_Invoice)]
    public class SalesInvoiceController : ezinvmvcControllerBase
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
    }
}