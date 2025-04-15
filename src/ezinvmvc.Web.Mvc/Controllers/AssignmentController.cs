using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Sales;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Assignment;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class AssignmentController : ezinvmvcControllerBase
    {
        private readonly ITasksService _tasksService;
        private readonly IEmployeeService _empService;

        public AssignmentController(ITasksService tasksService, IEmployeeService empService)
        {
            _tasksService = tasksService;
            _empService = empService;
        }
        public async Task<IActionResult> Index()
        {
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var model = new AssignmentListViewModel
            {
                EmpId = emp.Items[0].Id,
                FilterText = Request.Query["filterText"]
            };

            return View(model);
        }
    }
}