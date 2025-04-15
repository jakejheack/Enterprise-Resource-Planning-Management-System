using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class ReportsController : ezinvmvcControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult AttAdjReport()
        {
            return View();
        }
        public IActionResult PRSummaryReport()
        {
            return View();
        }
        public IActionResult SSSummaryReport()
        {
            return View();
        }
        public IActionResult PhltSummaryReport()
        {
            return View();
        }
        public IActionResult PgbSummaryReport()
        {
            return View();
        }
        public IActionResult OTAdjSummaryReport()
        {
            return View();
        }
        public IActionResult LoanSummaryReport()
        {
            return View();
        }

        public IActionResult AttAdjSummaryReport()
        {
            return View();
        }

        public IActionResult PayrollDetailReport()
        {
            return View();
        }
        public IActionResult SalesOrderReport()
        {
            return View();
        }
        public IActionResult SalesOrderSummaryReport()
        {
            return View();
        }
        public IActionResult Month13()
        {
            return View();
        }
        public IActionResult PayrollJournalDetails()
        {
            return View();
        }
        public IActionResult Employee201Report()
        {
            return View();
        }
        public IActionResult EmployeeMasterListReport()
        {
            return View();
        }
        public IActionResult RateMasterListReport()
        {
            return View();
        }
        public IActionResult LoanCollectionList()
        {
            return View();
        }

        public IActionResult LoanSummaryReportList()
        {
            return View();
        }

        public IActionResult PremiumDeductionReport()
        {
            return View();
        }

        public IActionResult OTSummaryReport()
        {
            return View();
        }
    }
}