using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class EmployeeBioAttController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Adjustment()
        {
            return View();
        }
    }
}