using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.Common;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class TaxTypeController : ezinvmvcControllerBase
    {
        private readonly ITaxTypeServices _taxTypeService;

        public TaxTypeController(ITaxTypeServices taxTypeService)
        {
            _taxTypeService = taxTypeService;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}