using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Sales;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Sales;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class QuotationsController : ezinvmvcControllerBase
    {
        private readonly IQuotationService _quotService;
        private readonly IEmployeeService _empService;

        public QuotationsController(IQuotationService quotService, IEmployeeService empService)
        {
            _quotService = quotService;
            _empService = empService;
        }

        [AbpAuthorize(PermissionNames.Pages_Quotations)]
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
            var model = new QuotationListViewModel(); 
            if (emp.Items.Count > 0)
            {
                model = new QuotationListViewModel
                {
                    EmpId = emp.Items[0].Id,
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

            var model = new QuotationListViewModel
            {
                EmpId = emp.Items[0].Id
            };

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
            var model = new QuotationListViewModel();
            if (emp.Items.Count > 0)
            {
                model = new QuotationListViewModel
                {
                    EmpId = emp.Items[0].Id
                };
            }
            return View(model);
        }
        public async Task<ActionResult> Details(int id)
        {
            ViewBag.Id = id;
            return View();
        }
        public async Task<ActionResult> Print(int id)
        {
            ViewBag.Id = id;
            return View();
        }

        //[HttpPost]
        //public async Task<IActionResult> UploadFile(IFormFile file, string code)
        //{
        //    if (file == null || file.Length == 0)
        //        return Content("file not selected");

        //    var serverpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "products", code);

        //    var fullpath = Path.Combine(serverpath, file.GetFilename());

        //    string filename = file.GetFilename();
        //    if (Directory.Exists(serverpath))
        //    {
        //        Directory.Delete(serverpath, true);
        //    }

        //    Directory.CreateDirectory(serverpath);

        //    ResizeAndSaveImage(file.OpenReadStream(), fullpath);

        //    return Json(new { success = true });
        //}
    }
}