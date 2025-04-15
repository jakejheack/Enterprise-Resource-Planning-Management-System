using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Payroll;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class PayrollController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Payroll()
        {
            return View();
        }
        public IActionResult PayrollReport()
        {
            return View();
        }
        public IActionResult Edit(int id, int empCode, int empId, string attid)
        {
            ViewBag.Id = id;
            ViewBag.EmpId = empId;
            ViewBag.EmpCode = empCode;
            ViewBag.Attid = attid;
            return View();
        }
        public IActionResult PayrollAkcnowledgement()
        {
            return View();
        }
    }
}