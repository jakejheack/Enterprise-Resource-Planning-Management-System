using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.Accounting;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.JournalEntry;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class JournalEntryController : ezinvmvcControllerBase
    {
        private readonly IJournalEntryService _journalEntryService;
        private readonly IEmployeeService _empService;

        public JournalEntryController(IJournalEntryService journalEntryService, IEmployeeService empService)
        {
            _journalEntryService = journalEntryService;
            _empService = empService;
        }

        public async Task<IActionResult> Index()
        {

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;

            var emp = await _empService.GetEmployees(input);

            var model = new JournalEntryListModel();
            if (emp.Items.Count > 0)
            {
                model = new JournalEntryListModel()
                {
                    EmpId = emp.Items[0].Id,
                    FilterText = Request.Query["filterText"]
                };
            }
            else
            {
                //return RedirectToAction("Index", "Home");
                model = new JournalEntryListModel()
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

            var model = new JournalEntryCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new JournalEntryCreateModel()
                {
                    EmpId = emp.Items[0].Id,
                };
            }
            else {
                model = new JournalEntryCreateModel()
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

            var model = new JournalEntryCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new JournalEntryCreateModel()
                {
                    EmpId = emp.Items[0].Id,
                };
            }
            else
            {
                model = new JournalEntryCreateModel()
                {
                    EmpId = 0,
                };
            }

            return View(model);
        }
    }
}