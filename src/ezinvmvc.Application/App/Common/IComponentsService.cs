using Abp;
using Abp.Application.Services;
using System.Collections.Generic;

namespace ezinvmvc.App.Common
{
    public interface IComponentsService: IApplicationService
    {
        List<NameValue<string>> GetOrdersStatus();
    }
}
