using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Sales;
using ezinvmvc.App.Vendors;
using ezinvmvc.App.Vendors.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Rfq;
using ezinvmvc.Web.Models.Vendors;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class RFQController : ezinvmvcControllerBase
    {
        private readonly IRFQService _rfqService;
        private readonly IEmployeeService _empService;
        private readonly IPermissionChecker _permissionChecker;

        public RFQController(IRFQService rfqService, IEmployeeService empService, IPermissionChecker permissionChecker)
        {
            _rfqService = rfqService;
            _empService = empService;
            _permissionChecker = permissionChecker;
        }

        public async Task<IActionResult> Index()
        {
            #region JOMS User Restriction 10212019
            //var model = new LeadViewModel
            //{
            //    FilterText = Request.Query["filterText"]
            //};

            //return View(model);
            #endregion JOMS User Restriction 10212019

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;

            var emp = await _empService.GetEmployees(input);

            var model = new RfqListViewModel();
            if (!_permissionChecker.IsGranted("Pages.Rfq.AllAccounts"))
            {
                if (emp.Items.Count > 0)
                {
                    model = new RfqListViewModel()
                    {
                        EmpId = emp.Items[0].Id,
                        FilterText = Request.Query["filterText"]
                    };
                }
                else
                {
                    TempData["Message"] = "User has no Employee Record. \nContact your System Administrator to get Employee Record.";
                    TempData["MessageTitle"] = "RFQ";
                    //Response.Write(@"<script language='javascript'>alert('Message: \n" + "Hi!" + " .');</script>");
                    //ViewBag.Message = string.Format("You are not authorized.");
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                //TempData["Message"] = "You are not authorized.";
                //Response.Write(@"<script language='javascript'>alert('Message: \n" + "Hi!" + " .');</script>");
                //ViewBag.Message = string.Format("You are not authorized.");
                //return RedirectToAction("Index", "Home");
                model = new RfqListViewModel()
                {
                    EmpId = -1,
                    FilterText = Request.Query["filterText"]
                };
            }


            return View(model);
        }

        public async Task<ActionResult> Create()
        {
            #region JOMS User Restriction 10212019
            //return View(model);
            #endregion JOMS User Restriction 10212019

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var model = new RfqCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new RfqCreateModel()
                {
                    EmpId = emp.Items[0].Id,
                };
            }
            else
            {
                model = new RfqCreateModel()
                {
                    EmpId = 0,
                };
            }

            return View(model);
        }
        public async Task<ActionResult> Edit(int id)
        {
            ViewBag.Id = id;
            #region JOMS User Restriction 10212019
            //return View(model);
            #endregion JOMS User Restriction 10212019

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var model = new RfqCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new RfqCreateModel()
                {
                    EmpId = emp.Items[0].Id,
                };
            }
            else {
                model = new RfqCreateModel()
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
        public async Task<ActionResult> Revision(int id)
        {
            ViewBag.Id = id;
            return View();
        }

    }
}