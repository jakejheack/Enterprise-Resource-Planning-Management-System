using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ezinvmvc.App.Products.Dto;

namespace ezinvmvc.Web.Models.Products
{
    [AutoMapFrom(typeof(PagedResultDto<GetProductOutput>))]
    public class IndexViewModel : PagedResultDto<GetProductOutput>
    {
        public IndexViewModel(ListResultDto<GetProductOutput> output)
        {
            output.MapTo(this);
        }
    }
}
