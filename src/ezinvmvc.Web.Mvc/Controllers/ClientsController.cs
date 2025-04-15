using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Addresses;
using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Clients;
using ezinvmvc.App.Clients.Dto;
using ezinvmvc.App.Common;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Clients;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Master_Clients)]
    public class ClientsController : ezinvmvcControllerBase
    {
        private readonly IClientService _clientService;
        private readonly ICountryService _countryService;
        private readonly IProvinceService _provinceService;
        private readonly ICityService _cityService;
        private readonly IIndustryService _industryService;
        private readonly ICommonService _commonService;
        private readonly IEmployeeService _empService;
        private readonly IPermissionChecker _permissionChecker;

        public ClientsController(IClientService clientService, ICountryService countryService, IProvinceService provinceService, ICityService cityService, IIndustryService industryService, ICommonService commonService, IEmployeeService empService, IPermissionChecker permissionChecker)
        {
            _clientService = clientService;
            _countryService = countryService;
            _provinceService = provinceService;
            _cityService = cityService;
            _industryService = industryService;
            _commonService = commonService;
            _empService = empService;
            _permissionChecker = permissionChecker;
        }

        public async Task<IActionResult> Index()
        {
            #region JOMS User Restriction 10212019
            //var model = new LeadViewModel
            //{
            //    FilterText = Request.Query["filterText"]
            //};

            //return View(model);
            #endregion JOMS User Restriction 10212019

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);
            var model = new ClientViewModel();
            if (!_permissionChecker.IsGranted("Master.Clients.AllAccounts"))
            {
                if (emp.Items.Count > 0)
                {
                    model = new ClientViewModel
                    {
                        EmpId = emp.Items[0].Id,
                        EmpIdFilter = emp.Items[0].Id,
                        FilterText = Request.Query["filterText"]
                    };
                }
                else
                {
                    TempData["Message"] = "User has no Employee Record. \nContact your System Administrator to get Employee Record.";
                    TempData["MessageTitle"] = "Clients";
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                if (emp.Items.Count > 0)
                {
                    model = new ClientViewModel
                    {
                        EmpId = emp.Items[0].Id,
                        EmpIdFilter = emp.Items[0].Id,
                        FilterText = Request.Query["filterText"]
                    };
                }
                else
                {
                    TempData["Message"] = "User has no Employee Record. \nContact your System Administrator to get Employee Record.";
                    TempData["MessageTitle"] = "Clients";
                    return RedirectToAction("Index", "Home");
                }
            }

            return View(model);
        }

        public async Task<ActionResult> Create()
        {
            var getindusries = await _industryService.GetIndustries();
            var getcountries = await _countryService.GetCountrys();
            //var gettaxtypes = await _commonService.GetTaxTypes();

            List<GetIndustryOutput> industries = getindusries.Cast<GetIndustryOutput>().ToList();
            List<GetCountryOutput> countries = getcountries.Cast<GetCountryOutput>().ToList();
            //List<GetTaxtTypeOutput> taxttypes = gettaxtypes;

            CreateClientInput client = new CreateClientInput();

            var model = new ClientCreateModel
            {
                Client = client,
                Industries = industries,
                Countries = countries
            };
            return View(model);
        }


        public async Task<ActionResult> Edit(int id)
        {
            ModelState.Clear();
            GetClientInput clientinput = new GetClientInput();
            clientinput.Id = id;

            var getclient = await _clientService.GetClient(clientinput);
            GetCountryInput countryinput = new GetCountryInput();
            countryinput.Id = getclient.CountryId;
            GetProvinceInput provinceinput = new GetProvinceInput();
            provinceinput.Id = getclient.ProvinceId;

            var getindusries = await _industryService.GetIndustries();
            var getcountries = await _countryService.GetCountrys();
            var getprovinces = await _countryService.GetProvinces(countryinput);
            var getcities = await _provinceService.GetCities(provinceinput);

            List<GetIndustryOutput> industries = getindusries.Cast<GetIndustryOutput>().ToList();
            List<GetCountryOutput> countries = getcountries.Cast<GetCountryOutput>().ToList();
            List<GetProvinceOutput> provinces = getprovinces.Cast<GetProvinceOutput>().ToList();
            List<GetCityOutput> cities = getcities.Cast<GetCityOutput>().ToList();
            var client = Mapper.Map<UpdateClientInput>(getclient);

            var model = new ClientEditModel
            {
                Client = client,
                Industries = industries,
                Countries = countries,
                Provinces = provinces,
                Cities = cities
            };
            return View(model);
        }

        public async Task<ActionResult> CreateModal()
        {
            var getindusries = await _industryService.GetIndustries();
            var getcountries = await _countryService.GetCountrys();
            //var gettaxtypes = await _commonService.GetTaxTypes();

            List<GetIndustryOutput> industries = getindusries.Cast<GetIndustryOutput>().ToList();
            List<GetCountryOutput> countries = getcountries.Cast<GetCountryOutput>().ToList();
            //List<GetTaxtTypeOutput> taxttypes = gettaxtypes;

            CreateClientInput client = new CreateClientInput();

            var model = new ClientCreateModel
            {
                Client = client,
                Industries = industries,
                Countries = countries
            };
            return View("_CreateModal", model);
        }

        [AbpMvcAuthorize(PermissionNames.Master_Clients_Details)]
        public async Task<ActionResult> Details(int id)
        {
            GetClientInput clientinput = new GetClientInput();
            clientinput.Id = id;

            var getclient = await _clientService.GetClient(clientinput);
            var client = Mapper.Map<GetClientOutput>(getclient);
            var model = new ClientDetailsModel();

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            if (_permissionChecker.IsGranted("CRM.Leads.AccountExecutive") || !_permissionChecker.IsGranted("Master.Clients.AccountExecutive"))
            {
                if (emp.Items.Count > 0)
                {
                    model = new ClientDetailsModel()
                    {
                        EmpId = emp.Items[0].Id,
                        Client = client
                    };
                }
                else
                {
                    TempData["Message"] = "User has no Employee Record. \nContact your System Administrator to get Employee Record.";
                    TempData["MessageTitle"] = "Leads";
                    
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                model = new ClientDetailsModel()
                {
                    EmpId = -1,
                    Client = client
                };
            }
            
            return View(model);
        }
    }
}