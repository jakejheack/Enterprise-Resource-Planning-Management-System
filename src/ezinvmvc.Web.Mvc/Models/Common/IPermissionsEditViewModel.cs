using System.Collections.Generic;
using ezinvmvc.Roles.Dto;

namespace ezinvmvc.Web.Models.Common
{
    public interface IPermissionsEditViewModel
    {
        List<FlatPermissionDto> Permissions { get; set; }
    }
}