using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.CheckVoucher;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.CV;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class CVController : ezinvmvcControllerBase
    {
        private readonly ICVService _cvService;
        private readonly IEmployeeService _empService;

        public CVController(ICVService cvService, IEmployeeService empService)
        {
            _cvService = cvService;
            _empService = empService;
        }

        public async Task<IActionResult> Index()
        {
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;

            var emp = await _empService.GetEmployees(input);

            var model = new CVListModel();
            if (emp.Items.Count > 0)
            {
                model = new CVListModel()
                {
                    EmpId = emp.Items[0].Id,
                    FilterText = Request.Query["filterText"]
                };
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }


            return View(model);
        }

        public async Task<ActionResult> Create()
        {

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var model = new CVCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new CVCreateModel()
                {
                    EmpId = emp.Items[0].Id,
                };
            }

            return View(model);
        }

        public async Task<ActionResult> Edit(int id)
        {
            ViewBag.Id = id;
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var model = new CVCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new CVCreateModel()
                {
                    EmpId = emp.Items[0].Id,
                };
            }

            return View(model);
        }

        public async Task<ActionResult> Details(int id)
        {
            ViewBag.Id = id;
            return View();
        }

    }
}