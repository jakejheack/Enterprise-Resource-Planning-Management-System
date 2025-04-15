using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.RequestForPayment;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.RFP;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class RFPController : ezinvmvcControllerBase
    {
        private readonly IRFPService _rfpService;
        private readonly IEmployeeService _empService;

        public RFPController(IRFPService rfpService, IEmployeeService empService)
        {
            _rfpService = rfpService;
            _empService = empService;
        }

        public async Task<IActionResult> Index()
        {
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;

            var emp = await _empService.GetEmployees(input);

            var model = new RFPListModel();
            if (emp.Items.Count > 0)
            {
                model = new RFPListModel()
                {
                    EmpId = emp.Items[0].Id,
                    FilterText = Request.Query["filterText"]
                };
            }
            else
            {
                //return RedirectToAction("Index", "Home");
                model = new RFPListModel()
                {
                    EmpId = 0,
                    FilterText = Request.Query["filterText"]
                };
            }


            return View(model);
        }

        public async Task<ActionResult> Create()
        {

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var model = new RFPCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new RFPCreateModel()
                {
                    EmpId = emp.Items[0].Id,
                };
            }
            else
            {
                model = new RFPCreateModel()
                {
                    EmpId = 0,
                };
            }


            return View(model);
        }

        public async Task<ActionResult> Details(int id)
        {
            ViewBag.Id = id;
            return View();
        }

        public async Task<ActionResult> Edit(int id)
        {
            ViewBag.Id = id;
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var model = new RFPCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new RFPCreateModel()
                {
                    EmpId = emp.Items[0].Id,
                };
            }
            else
            {
                model = new RFPCreateModel()
                {
                    EmpId = 0,
                };
            }

            return View(model);
        }
    }
}