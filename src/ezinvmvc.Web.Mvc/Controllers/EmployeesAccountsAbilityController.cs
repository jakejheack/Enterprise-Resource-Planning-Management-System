using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.EmployeesAccountsAbility;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class EmployeesAccountsAbilityController : ezinvmvcControllerBase
    {
        //private readonly IAccountAbilityService _accountAbilityService;
        public IActionResult Index()
        {
            return View();
        }
    }
}