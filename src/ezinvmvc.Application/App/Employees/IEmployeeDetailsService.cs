using Abp.Application.Services;
using ezinvmvc.App.Employees.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public interface IEmployeeDetailsService : IApplicationService
    {
        Task CreateEmployeeDetails(CreateEmployeeDetailsInput input);
        Task UpdateEmployeeDetails(UpdateEmployeeDetailsInput input);
        Task<GetEmployeeDetailsOutput> GetEmployeeDetail(GetEmployeeDetailsInput input);
        Task<IEnumerable<GetEmployeeDetailsOutput>> GetDetailId(GetEmployeeDetailsInput input);
    }
}
