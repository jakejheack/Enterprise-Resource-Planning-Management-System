using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp.Application.Services.Dto;
using Abp.AspNetCore.Mvc.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using ezinvmvc.Roles;
using ezinvmvc.Roles.Dto;
using ezinvmvc.Web.Models.Roles;

namespace ezinvmvc.Web.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Master_Roles)]
    public class RolesController : ezinvmvcControllerBase
    {
        private readonly IRoleAppService _roleAppService;

        public RolesController(IRoleAppService roleAppService)
        {
            _roleAppService = roleAppService;
        }

        public async Task<IActionResult> Index()
        {
            //var roles = (await _roleAppService.GetRolesAsync(new GetRolesInput())).Items;
            var permissions = (await _roleAppService.GetAllPermissions()).Items;
            RoleListDto roles = new RoleListDto();
            var model = new RoleListViewModel
            {
                //Roles = roles,
                Permissions = permissions
            };

            return View(model);
        }

        public async Task<ActionResult> EditRoleModal(int roleId)
        {
            var output = await _roleAppService.GetRoleForEdit(new EntityDto(roleId));
            var model = new EditRoleModalViewModel(output);

            return View("_EditRoleModal", model);
        }
    }
}
