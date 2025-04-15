using Abp.AspNetCore.Mvc.Authorization;
using AutoMapper;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.GroupTypes;
using ezinvmvc.App.GroupTypes.Dto;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using ezinvmvc.Users;
using ezinvmvc.Web.Models.Employees;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class EmployeesController : ezinvmvcControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IGroupTypeService _groupTypeService;
        private readonly IDepartmentService _departmentService;
        private readonly IDivEmployeeService _divEmployeeService;
        private readonly ISectorService _sectorService;
        private readonly IPositionService _positionService;
        private readonly IEmployeeDetailsService _employeeDetailsService;

        public EmployeesController(IEmployeeService employeeservice, IGroupTypeService grouptypeservice,IDepartmentService departmentService,IDivEmployeeService divEmployeeService, ISectorService sectorService,IPositionService positionService, IEmployeeDetailsService employeeDetailsService)
        {
            _employeeService = employeeservice;
            _groupTypeService = grouptypeservice;
            _departmentService = departmentService;
            _divEmployeeService = divEmployeeService;
            _sectorService = sectorService;
            _positionService = positionService;
            _employeeDetailsService = employeeDetailsService;
        }
        
        [AbpMvcAuthorize(PermissionNames.Master_Employees)]
        public async Task<ActionResult> Index(GetEmployeeListInput input)
        {
             var getGroup = await _groupTypeService.GetGroupTypeGroup();

            List<GetGroupTypeGroupOutput> groupTypes = getGroup.Cast<GetGroupTypeGroupOutput>().ToList();

            var model = new EmployeesViewModel
            {
                GroupTypes = groupTypes,
                FilterText = Request.Query["filterText"],
            };

            return View(model);
        }
        
        public ActionResult Create()
        {
            CreateEmployeeInput employee = new CreateEmployeeInput();

            var model = new EmployeesViewModel
            {
                Employee = employee                
            };
            return View(model);
        }
        public async Task<ActionResult> Update(int id)
        {
            ModelState.Clear();
            GetEmployeeInput employeeInput = new GetEmployeeInput();
            employeeInput.Id = id;
            GetEmployeeListInput userInput = new GetEmployeeListInput();
            userInput.Filter = "null|" + id.ToString();

            var getDepartment = await _departmentService.GetAllDepartment();
            var getDivision = await _divEmployeeService.GetAllDivEmployees();
            var getemployee = await _employeeService.GetEmployee(employeeInput);
            var getsector = await _sectorService.GetAllSectors();
            var getposition = await _positionService.GetAllPositions();
            var getGroup = await _groupTypeService.GetGroupTypeGroup();
            var getUser = await _employeeService.GetUsersNoEmployee(userInput);
            var getAllEmployee = await _employeeService.GetAllEmployeeAsync();
            //var getUser = await _userAppService.GetAll();

            List<GetDepartmentOutput> getDepartments = getDepartment.Cast<GetDepartmentOutput>().ToList();
            List<GetGroupTypeGroupOutput> groupTypes = getGroup.Cast<GetGroupTypeGroupOutput>().ToList();
            List<GetDivEmployeeOutput> getDivisions = getDivision.Cast<GetDivEmployeeOutput>().ToList();
            List<GetSectorOutput> getSectors = getsector.Cast<GetSectorOutput>().ToList();
            List<GetPositionOutput> getPositions = getposition.Cast<GetPositionOutput>().ToList();
            List<GetEmployeeOutput> getUsers = getUser.Items.ToList();
            List<GetEmployeeOutput> getAllEmployees = getAllEmployee.Cast<GetEmployeeOutput>().ToList();

            var employee = Mapper.Map<CreateEmployeeInput>(getemployee);
            var model = new EmployeeCreateModel
            {
                Positions = getPositions,
                Sertors = getSectors,
                DivEmployee = getDivisions,
                Departments = getDepartments,
                Employee = employee,
                GroupTypes = groupTypes,
                Users = getUsers,
                Manager = getAllEmployees
            };
            return View(model);
        }

        public async Task<ActionResult> Details(int id)
        {
            ModelState.Clear();
            GetEmployeeDetailsInput employeeDetailsInput = new GetEmployeeDetailsInput();
            employeeDetailsInput.EmployeeId = id;

            var getEmployeeDetails = await _employeeDetailsService.GetDetailId(employeeDetailsInput);

            var employeeDetails = Mapper.Map<GetEmployeeDetailsOutput>(getEmployeeDetails);

            //List<GetEmployeeDetailsOutput> EmployeeDetail = getEmployeeDetails.Cast<GetEmployeeDetailsOutput>().ToList();
            //employeeDetails.OldId = employeeDetailsInput.EmployeeId;

            var model = new EmployeesDetailsModel
            {
                EmpOutput = employeeDetails
            };
            return View(model);
        }

        public async Task<ActionResult> CreateDepartmentModal()
        {
            var name = new CreateDepartmentInput();
            var model = new DepartmentCreateModel
            {
                Name = name
            };
            return View("_CreateDepartmentModal", model);
        }
        public async Task<ActionResult> CreateDivisionModal()
        {
            var name = new CreateDivEmployeeInput();
            var model = new DivisionCreateModel
            {
                Name = name
            };
            return View("_CreateDivisionModal", model);
        }
        public async Task<ActionResult> CreateSectorModal()
        {
            var name = new CreateSectorInput();
            var model = new SectorCreateModel
            {
                Name = name
            };
            return View("_CreateSectorModal", model);
        }
        public async Task<ActionResult> CreatePositionModal()
        {
            var name = new CreatePositionInput();
            var model = new PositionCreateModel
            {
                Name = name
            };
            return View("_CreatePositionModal", model);
        }
    }
}