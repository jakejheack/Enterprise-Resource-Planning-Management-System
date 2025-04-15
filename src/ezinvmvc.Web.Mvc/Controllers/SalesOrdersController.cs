using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Vendors;
using ezinvmvc.App.Vendors.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Vendors;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class SalesOrdersController : ezinvmvcControllerBase
    {
        private readonly IEmployeeService _empService;

        public SalesOrdersController(IEmployeeService empService)
        {
            _empService = empService;
        }

        public async Task<IActionResult> Index()
        {
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;

            var emp = await _empService.GetEmployees(input);

            if (emp.Items.Count > 0)
            {
                ViewBag.EmpId = emp.Items[0].Id;
            }
            else
            {
                ViewBag.EmpId = -1;
            }
            return View();
        }
        public async Task<ActionResult> Create()
        {
            return View();
        }
        public async Task<ActionResult> Edit(int id)
        {
            ViewBag.Id = id;
            return View();
        }
        public async Task<ActionResult> Details(int id)
        {
            ViewBag.Id = id;
            return View();
        }
    }
}