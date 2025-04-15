using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Addresses;
using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Clients;
using ezinvmvc.App.Clients.Dto;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Leads;
using ezinvmvc.App.Leads.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Leads;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class LeadsController : ezinvmvcControllerBase
    {
        private readonly ILeadService _leadService;
        private readonly ILeadUpdateService _leadUpdateService;
        private readonly ILeadSourceService _sourceService;
        private readonly ILeadTaskService _taskService;
        private readonly IIndustryService _industryService;
        private readonly ICountryService _countryService;
        private readonly IProvinceService _provinceService;
        private readonly ICityService _cityService;
        private readonly IEmployeeService _empService;
        private readonly IPermissionChecker _permissionChecker;

        public LeadsController(ILeadService leadService, ILeadUpdateService leadUpdateService, ILeadSourceService sourceService, ILeadTaskService taskService, IIndustryService industryService, ICountryService countryService, IProvinceService provinceService, ICityService cityService, IEmployeeService empService, IPermissionChecker permissionChecker)
        {
            _leadService = leadService;
            _leadUpdateService = leadUpdateService;
            _sourceService = sourceService;
            _taskService = taskService;
            _industryService = industryService;
            _countryService = countryService;
            _provinceService = provinceService;
            _cityService = cityService;
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

            var model = new LeadViewModel();

            if (!_permissionChecker.IsGranted("CRM.Leads.AllAccounts"))
            {
                if (emp.Items.Count > 0)
                {
                    model = new LeadViewModel()
                    {
                        EmpId = emp.Items[0].Id,
                        FilterText = Request.Query["filterText"]
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
                model = new LeadViewModel()
                {
                    EmpId = -1,
                    FilterText = Request.Query["filterText"]
                };
            }

            return View(model);
        }

        public async Task<ActionResult> Create()
        {
            var getsources = await _sourceService.GetLeadSources();
            var gettasks = await _taskService.GetLeadTasks();
            //var getindustries = await _industryService.GetIndustries();
            //var getcountries = await _countryService.GetCountrys();
            //var getusers = await _userService.GetAllClients();

            List<GetLeadSourceOutput> sources = getsources.Cast<GetLeadSourceOutput>().ToList();
            List<GetLeadTaskOutput> tasks = gettasks.Cast<GetLeadTaskOutput>().ToList();
            //List<GetIndustryOutput> industries = getindustries.Cast<GetIndustryOutput>().ToList();
            //List<GetCountryOutput> countries = getcountries.Cast<GetCountryOutput>().ToList();
            //List<GetEmployeeOutput> users = getusers.Cast<GetEmployeeOutput>().ToList();

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            CreateLeadInput lead = new CreateLeadInput();
            var model = new LeadCreateModel();
            if (emp.Items.Count > 0)
            {
                model = new LeadCreateModel()
                {

                    Lead = lead,
                    Sources = sources,
                    Tasks = tasks,
                    EmpId = emp.Items[0].Id
                    //Industries= industries,
                    //Countries = countries,
                    //Users = users
                };
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
            return View(model);
        }

        public async Task<ActionResult> Edit(int id)
        {
            ModelState.Clear();
            GetLeadInput leadinput = new GetLeadInput();
            leadinput.Id = id;

            var getlead = await _leadService.GetLead(leadinput);

            //GetCountryInput countryinput = new GetCountryInput();
            //countryinput.Id = getlead.CountryId;
            //GetProvinceInput provinceinput = new GetProvinceInput();
            //provinceinput.Id = getlead.ProvinceId;

            var getsources = await _sourceService.GetLeadSources();
            var gettasks = await _taskService.GetLeadTasks();
            //var getindustries = await _industryService.GetIndustries();
            //var getcountries = await _countryService.GetCountrys();
            //var getprovinces = await _countryService.GetProvinces(countryinput);
            //var getcities = await _provinceService.GetCities(provinceinput);

            List<GetLeadSourceOutput> sources = getsources.Cast<GetLeadSourceOutput>().ToList();
            List<GetLeadTaskOutput> tasks = gettasks.Cast<GetLeadTaskOutput>().ToList();
            //List<GetIndustryOutput> industries = getindustries.Cast<GetIndustryOutput>().ToList();
            //List<GetCountryOutput> countries = getcountries.Cast<GetCountryOutput>().ToList();
            //List<GetProvinceOutput> provinces = getprovinces.Cast<GetProvinceOutput>().ToList();
            //List<GetCityOutput> cities = getcities.Cast<GetCityOutput>().ToList();
            //List<GetEmployeeOutput> users = getusers.Cast<GetEmployeeOutput>().ToList();

            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var lead = Mapper.Map<UpdateLeadInput>(getlead);
            //GetEmployeeInput einput = new GetEmployeeInput();
            //einput.Id = lead.AssignedToId;
            //var getusers = await _userService.GetEmployee(einput);
            //lead.AssignedTo = getusers.FirstName + " " + getusers.MiddleName + " " + getusers.LastName;

            var model = new LeadEditModel();
            if (emp.Items.Count > 0)
            {
                model = new LeadEditModel()
                {

                    Lead = lead,
                    Sources = sources,
                    Tasks = tasks,
                    EmpId = emp.Items[0].Id
                    //Industries = industries,
                    //Countries = countries,
                    //Provinces = provinces,
                    //Cities = cities
                    //Users = users
                };
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
            return View(model);
        }

        public async Task<ActionResult> Details(int id)
        {
            ModelState.Clear();
            GetLeadInput leadinput = new GetLeadInput();
            leadinput.Id = id;

            var getlead = await _leadService.GetLeadDetails(leadinput);

            var getsources = await _sourceService.GetLeadSources();
            var gettasks = await _taskService.GetLeadTasks();

            List<GetLeadSourceOutput> sources = getsources.Cast<GetLeadSourceOutput>().ToList();
            List<GetLeadTaskOutput> tasks = gettasks.Cast<GetLeadTaskOutput>().ToList();
            List<GetLeadOutput> leads = getlead.Cast<GetLeadOutput>().ToList();

            var lead = Mapper.Map<UpdateLeadInput>(leads[0]);
            GetEmployeeInput einput = new GetEmployeeInput();
            einput.Id = lead.AssignedToId;
            var getusers = await _empService.GetEmployee(einput);
            lead.AssignedTo = getusers.FirstName + " " + getusers.MiddleName + " " + getusers.LastName;
            
            GetEmployeeListInput input = new GetEmployeeListInput();
            input.Filter = "UserId|" + (int)AbpSession.UserId;
            var emp = await _empService.GetEmployees(input);

            var model = new LeadEditModel();

            if (emp.Items.Count > 0)
            {
                model = new LeadEditModel()
                {
                    Lead = lead,
                    Sources = sources,
                    Tasks = tasks,
                    EmpId = emp.Items[0].Id

                };
            }
            else
            {
                model = new LeadEditModel()
                {
                    Lead = lead,
                    Sources = sources,
                    Tasks = tasks,
                    EmpId = -1

                };
            }
            return View(model);
        }

        public async Task<ActionResult> CreateLeadUpdateModal(int id, int uid)
        {
            GetLeadInput leadinput = new GetLeadInput();
            leadinput.Id = id;

            var getlead = await _leadService.GetLead(leadinput);

            var gettasks = await _taskService.GetLeadTasks();
            GetEmployeeInput empinput = new GetEmployeeInput();
            List<GetLeadTaskOutput> tasks = gettasks.Cast<GetLeadTaskOutput>().ToList();
            //List<GetEmployeeOutput> users = getusers.Cast<GetEmployeeOutput>().ToList();

            var leadupdate = new CreateLeadUpdateInput();
            if (uid > 0)
            {
                GetLeadUpdateInput uleadinput = new GetLeadUpdateInput();
                uleadinput.Id = uid;
                var getleadupdate = await _leadUpdateService.GetLeadUpdate(uleadinput);
                empinput.Id = getleadupdate.AssignedToId;
                var getusers = await _empService.GetEmployee(empinput);
                leadupdate.LeadTaskId = getleadupdate.LeadTaskId;
                leadupdate.NextContactDateTime = getleadupdate.NextContactDateTime;
                leadupdate.AssignedToId = getleadupdate.AssignedToId;
                leadupdate.AssignedTo = getusers.FirstName + " " + getusers.MiddleName + " " + getusers.LastName;
                leadupdate.AssignedToEmail = getleadupdate.AssignedToEmail;
            }
            else
            {
                empinput.Id = getlead.AssignedToId;
                var getusers = await _empService.GetEmployee(empinput);
                leadupdate.LeadTaskId = getlead.LeadTaskId;
                leadupdate.NextContactDateTime = getlead.NextContactDateTime;
                leadupdate.AssignedToId = getlead.AssignedToId;
                leadupdate.AssignedTo = getusers.FirstName + " " + getusers.MiddleName + " " + getusers.LastName;
                leadupdate.AssignedToEmail = getlead.AssignedToEmail;
            }
            var model = new LeadUpdateCreateModel
            {
                LeadUpdate = leadupdate,
                Lead = getlead,
                Tasks = tasks
                //Users = users
            };
            return View("_CreateLeadUpdateModal", model);
        }

        public async Task<ActionResult> CreateSingleLeadUpdateModal(int id, int uid)
        {
            GetLeadInput leadinput = new GetLeadInput();
            leadinput.Id = id;

            var getlead = await _leadService.GetLead(leadinput);

            var gettasks = await _taskService.GetLeadTasks();
            GetEmployeeInput empinput = new GetEmployeeInput();
            List<GetLeadTaskOutput> tasks = gettasks.Cast<GetLeadTaskOutput>().ToList();
            //List<GetEmployeeOutput> users = getusers.Cast<GetEmployeeOutput>().ToList();

            var leadupdate = new CreateLeadUpdateInput();
            if (uid > 0)
            {
                GetLeadUpdateInput uleadinput = new GetLeadUpdateInput();
                uleadinput.Id = uid;
                var getleadupdate = await _leadUpdateService.GetLeadUpdate(uleadinput);
                empinput.Id = getleadupdate.AssignedToId;
                var getusers = await _empService.GetEmployee(empinput);
                leadupdate.LeadTaskId = getleadupdate.LeadTaskId;
                leadupdate.NextContactDateTime = getleadupdate.NextContactDateTime;
                leadupdate.AssignedToId = getleadupdate.AssignedToId;
                leadupdate.AssignedTo = getusers.FirstName + " " + getusers.MiddleName + " " + getusers.LastName;
                leadupdate.AssignedToEmail = getleadupdate.AssignedToEmail;
            }
            else
            {
                empinput.Id = getlead.AssignedToId;
                var getusers = await _empService.GetEmployee(empinput);
                leadupdate.LeadTaskId = getlead.LeadTaskId;
                leadupdate.NextContactDateTime = getlead.NextContactDateTime;
                leadupdate.AssignedToId = getlead.AssignedToId;
                leadupdate.AssignedTo = getusers.FirstName + " " + getusers.MiddleName + " " + getusers.LastName;
                leadupdate.AssignedToEmail = getlead.AssignedToEmail;
            }
            var model = new LeadUpdateCreateModel
            {
                LeadUpdate = leadupdate,
                Lead = getlead,
                Tasks = tasks
                //Users = users
            };
            return View("_CreateSingleLeadUpdateModal", model);
        }
    }
}