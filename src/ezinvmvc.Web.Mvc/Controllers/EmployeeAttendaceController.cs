using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class EmployeeAttendaceController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}