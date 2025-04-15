using Abp;
using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Common
{
    public interface ISeriesTypeService : IApplicationService
    {
        List<NameValue<string>> GetAllList();
    }
}
