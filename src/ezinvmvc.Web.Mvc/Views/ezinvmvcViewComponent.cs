using Abp.AspNetCore.Mvc.ViewComponents;

namespace ezinvmvc.Web.Views
{
    public abstract class ezinvmvcViewComponent : AbpViewComponent
    {
        protected ezinvmvcViewComponent()
        {
            LocalizationSourceName = ezinvmvcConsts.LocalizationSourceName;
        }
    }
}
