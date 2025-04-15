using Microsoft.AspNetCore.Mvc.Razor.Internal;
using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;

namespace ezinvmvc.Web.Views
{
    public abstract class ezinvmvcRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected ezinvmvcRazorPage()
        {
            LocalizationSourceName = ezinvmvcConsts.LocalizationSourceName;
        }
    }
}
