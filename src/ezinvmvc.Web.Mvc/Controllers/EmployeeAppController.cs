using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class EmployeeAppController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            ViewBag.UserId = (int)AbpSession.UserId;
            return View();
        }
    }
}