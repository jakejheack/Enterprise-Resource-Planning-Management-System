using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using AutoMapper;
using ezinvmvc.App.Vendors;
using ezinvmvc.App.Vendors.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Vendors;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class VendorsController : ezinvmvcControllerBase
    {
        private readonly IVendorService _vendorService;

        public VendorsController(IVendorService vendorService)
        {
            _vendorService = vendorService;
        }

        public IActionResult Index(GetVendorInput input)
        {
            List<string> countries = new List<string>();

            CultureInfo[] CInfoList = CultureInfo.GetCultures(CultureTypes.SpecificCultures);
            foreach (CultureInfo CInfo in CInfoList)
            {
                RegionInfo R = new RegionInfo(CInfo.LCID);
                if (!(countries.Contains(R.EnglishName)))
                {
                    countries.Add(R.EnglishName);
                }
            }

            var model = new VendorViewModel
            {
                FilterText = Request.Query["filterText"]
            };

            countries.Sort();
            ViewBag.Countries = countries;
            return View(model);
        }
        public async Task<ActionResult> EditModal(int id)
        {
            GetVendorInput input = new GetVendorInput();
            input.Id = id;
            var output = await _vendorService.GetVendor(input);
            var vendor = Mapper.Map<UpdateVendorInput>(output);

            var model = new VendorEditModel
            {
                Vendor = vendor
            };

            List<string> countries = new List<string>();
            CultureInfo[] CInfoList = CultureInfo.GetCultures(CultureTypes.SpecificCultures);
            foreach (CultureInfo CInfo in CInfoList)
            {
                RegionInfo R = new RegionInfo(CInfo.LCID);
                if (!(countries.Contains(R.EnglishName)))
                {
                    countries.Add(R.EnglishName);
                }
            }
            countries.Sort();
            ViewBag.Countries = countries;

            return View("_EditModal", model);
        }
    }
}