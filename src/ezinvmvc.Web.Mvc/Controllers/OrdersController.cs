using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp;
using ezinvmvc.App.Common;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Orders;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class OrdersController : ezinvmvcControllerBase
    {
        private readonly IComponentsService _vendorService;

        public OrdersController(IComponentsService vendorService)
        {
            _vendorService = vendorService;
        }
        public async Task<ActionResult> Index()
        {
            var status = _vendorService.GetOrdersStatus();

            var model = new OrdersViewModel
            {
                FilterText = "",
                Status = status
            };
            return View(model);
        }
    }
}