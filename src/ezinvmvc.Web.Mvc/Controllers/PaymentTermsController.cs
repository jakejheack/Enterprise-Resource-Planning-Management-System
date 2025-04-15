using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.Common;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class PaymentTermsController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}