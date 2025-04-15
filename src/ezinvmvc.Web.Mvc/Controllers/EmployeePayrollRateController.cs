using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.App.EmployeesSalaryRate;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class EmployeePayrollRateController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult PayrollRate()
        {
            return View();
        }
    }
}