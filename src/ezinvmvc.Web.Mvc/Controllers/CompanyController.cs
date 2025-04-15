using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ezinvmvc.App.Common;
using ezinvmvc.App.Common.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Company;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class CompanyController : ezinvmvcControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;

        }
        public async Task<IActionResult> Index()
        {
            return View();
        }
       
    }
}