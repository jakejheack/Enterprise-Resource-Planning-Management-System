using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ezinvmvc.App.Addresses;
using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Addresses;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class AddressesController : ezinvmvcControllerBase
    {
        private readonly ICountryService _countryService;
        private readonly IProvinceService _provinceService;
        private readonly ICityManager _cityManager;

        public AddressesController(ICountryService countryService, IProvinceService provinceService, ICityManager cityManager)
        {
            _countryService = countryService;
            _provinceService = provinceService;
            _cityManager = cityManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> CreateCountryModal()
        {
            var country = new CreateCountryInput();
            var model = new CountryCreateModel
            {
                Country = country
            };
            return View("_CreateCountryModal", model);
        }

        public async Task<ActionResult> CreateProvinceModal(int countryid)
        {
            var getcountries = await _countryService.GetCountrys();
            List<GetCountryOutput> countries = getcountries.Cast<GetCountryOutput>().ToList();

            var province = new CreateProvinceInput();
            
            var model = new ProvinceCreateModel
            {
                Province = province,
                Countries = countries
            };
            return View("_CreateProvinceModal", model);
        }
        
        public async Task<ActionResult> CreateCityModal(int coutryid, int provinceid)
        {
            var getcountries = await _countryService.GetCountrys();
            List<GetCountryOutput> countries = getcountries.Cast<GetCountryOutput>().ToList();

            var city = new CreateCityInput();
            city.CountryId = coutryid;
            city.ProvinceId = provinceid;
            var model = new CityCreateModel
            {
                City = city,
                Countries = countries
            };
            return View("_CreateCityModal", model);
        }

        [HttpPost]
        public async Task<IActionResult> GetCountries()
        {
            //GetCountryInput countryinput = new GetCountryInput();
            //countryinput.Id = countryid;
            var getcountries = await _countryService.GetCountrys();

            List<GetCountryOutput> countries = getcountries.Cast<GetCountryOutput>().ToList();

            return Json(countries);
        }

        [HttpPost]
        public async Task<IActionResult> GetProvinces(int countryid)
        {
            GetCountryInput countryinput = new GetCountryInput();
            countryinput.Id = countryid;
            var getprovinces = await  _countryService.GetProvinces(countryinput);

            List<GetProvinceOutput> provinces = getprovinces.Cast<GetProvinceOutput>().ToList();

            return Json(provinces);
        }

        [HttpPost]
        public async Task<IActionResult> GetCities(int provinceid)
        {
            GetProvinceInput provinceinput = new GetProvinceInput();
            provinceinput.Id = provinceid;
            var getcities = await _provinceService.GetCities(provinceinput);

            List<GetCityOutput> cities = getcities.Cast<GetCityOutput>().ToList();

            return Json(cities);
        }
    }
}