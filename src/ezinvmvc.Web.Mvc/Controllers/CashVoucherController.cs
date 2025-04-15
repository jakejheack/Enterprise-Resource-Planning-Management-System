using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.CheckVoucher;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class CashVoucherController : ezinvmvcControllerBase
    {
        //private readonly ICVService _cvService;
        private readonly IEmployeeService _empService;

        public CashVoucherController(
            //ICVService cvService, 
            IEmployeeService empService)
        {
            //_cvService = cvService;
            _empService = empService;
        }

        public async Task<IActionResult> Index()
        {
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;

            var emp = await _empService.GetEmployees(input);

            //var model = new CVListModel();
            if (emp.Items.Count > 0)
            {
                //model = new CVListModel()
                //{
                //    EmpId = emp.Items[0].Id,
                //    FilterText = Request.Query["filterText"]
                //};
                ViewBag.EmpId = emp.Items[0].Id;
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }


            return View();
        }

        public async Task<ActionResult> Create()
        {

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            //var model = new CVCreateModel();
            if (emp.Items.Count > 0)
            {
                //model = new CVCreateModel()
                //{
                //    EmpId = emp.Items[0].Id,
                //};
                ViewBag.EmpId = emp.Items[0].Id;
            }

            return View();
        }

        public async Task<ActionResult> Edit(int id)
        {
            ViewBag.Id = id;
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            //var model = new CVCreateModel();
            if (emp.Items.Count > 0)
            {
                //model = new CVCreateModel()
                //{
                ViewBag.EmpId = emp.Items[0].Id;
                //};
            }

            return View();
        }

        public async Task<ActionResult> Details(int id)
        {
            ViewBag.Id = id;
            return View();
        }

    }
}