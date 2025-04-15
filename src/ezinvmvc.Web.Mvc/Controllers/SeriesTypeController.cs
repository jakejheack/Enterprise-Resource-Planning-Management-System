using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.Common;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class SeriesTypeController : ezinvmvcControllerBase
    {
        private readonly ISeriesTypeService _seriesTypeService;

        public SeriesTypeController(ISeriesTypeService seriesTypeService)
        {
            _seriesTypeService = seriesTypeService;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}