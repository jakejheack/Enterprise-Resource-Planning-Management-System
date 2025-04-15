using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

using ezinvmvc.App;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class EmployeeAllowanceController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}