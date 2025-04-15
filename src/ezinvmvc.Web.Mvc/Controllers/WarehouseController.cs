using Abp.Application.Services.Dto;
using Abp.AspNetCore.Mvc.Authorization;
using AutoMapper;
using ezinvmvc.App.Common;
using ezinvmvc.App.Common.Dto;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Warehouse;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Master_Warehouse)]
    public class WarehouseController : ezinvmvcControllerBase
    {
        private readonly IWarehouseService _warehouseService;

        public WarehouseController(IWarehouseService warehouseService)
        {
            _warehouseService = warehouseService;
        }

        public IActionResult Index()
        {
            return View();
        }
        public async Task<ActionResult> Create()
        {
            CreateWarehouseInput warehouse = new CreateWarehouseInput();
            var model = new WarehouseCreateModel
            {
                Warehouse = warehouse
            };
            return View("_CreateWarehouseModal", model);
        }
        public async Task<ActionResult> Edit(int warehouseId)
        {
            GetWarehouseInput input = new GetWarehouseInput();
            input.Id = warehouseId;

            var output = await _warehouseService.GetWarehouse(input);
            var warehouse = Mapper.Map<UpdateWarehouseInput>(output);

            var model = new WarehouseEditModel
            {
                Warehouse = warehouse,
            };
            return View("_EditWarehouseModal", model);
        }
    }

   
}