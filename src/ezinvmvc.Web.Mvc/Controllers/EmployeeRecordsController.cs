using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.App.EmployeesRecords;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Master_Roles)]
    public class EmployeeRecordsController : ezinvmvcControllerBase
    {
        private readonly IEmployeeRecordService _employeeRecordService;

        public IActionResult Index()
        {
            return View();
        }
        public EmployeeRecordsController(IEmployeeRecordService employeeRecordService)
        {
            _employeeRecordService = employeeRecordService;
        }
    }
}