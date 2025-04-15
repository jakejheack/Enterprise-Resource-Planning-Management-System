using Microsoft.AspNetCore.Mvc;
using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.Controllers;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees;
using Abp.Authorization;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Controllers
{
    [AbpMvcAuthorize]
    public class HomeController : ezinvmvcControllerBase
    {
        private readonly IEmployeeService _empService;
        private readonly IPermissionChecker _permissionChecker;

        public HomeController(IEmployeeService empService, IPermissionChecker permissionChecker)
        {
            _empService = empService;
            _permissionChecker = permissionChecker;
        }

        public async Task<ActionResult> Index()
        {
            if (!AbpSession.UserId.HasValue)
            {
                RedirectToAction("Login", "Account");
            }
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            if (emp.Items.Count > 0)
            {
                ViewBag.EmpId = emp.Items[0].Id;
            }
            else
            {
                TempData["Message"] = "User has no Employee Record. \nContact your System Administrator to get Employee Record.";
                TempData["MessageTitle"] = "Leads";
            }


            if (TempData["Message"] != null && TempData["MessageTitle"] != null)
            {
                ViewBag.Message = TempData["Message"];
                ViewBag.MessageTitle = TempData["MessageTitle"];
                TempData.Remove("Message");
                TempData.Remove("MessageTitle");
            }
            else
            {
                ViewBag.Message = "";
                ViewBag.MessageTitle = "";
            }
            return View();
        }
	}
}
