using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ezinvmvc.App.Employees.Dto;

namespace ezinvmvc.Web.Models.Employees
{
    [AutoMapFrom(typeof(PagedResultDto<GetEmployeeOutput>))]
    public class IndexViewModel : PagedResultDto<GetEmployeeOutput>
    {
        public IndexViewModel(ListResultDto<GetEmployeeOutput> output)
        {
            output.MapTo(this);
        }
    }
}
