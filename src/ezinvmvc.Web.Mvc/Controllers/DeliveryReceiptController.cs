using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class DeliveryReceiptController  : ezinvmvcControllerBase
    {
        [AbpMvcAuthorize(PermissionNames.Pages_Delivery_Receipt)]
        public IActionResult Index()
        {
            return View();
        }

        [AbpMvcAuthorize(PermissionNames.Pages_Delivery_Receipt_Create)]
        public async Task<ActionResult> Create()
        {
            return View();
        }

        [AbpMvcAuthorize(PermissionNames.Pages_Delivery_Receipt_Edit)]
        public async Task<ActionResult> Edit(int id)
        {
            ViewBag.Id = id;
            return View();
        }
    }
}