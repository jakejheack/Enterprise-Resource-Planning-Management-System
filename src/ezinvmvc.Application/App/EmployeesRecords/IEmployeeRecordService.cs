using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesRecords.Dto;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public interface IEmployeeRecordService : IApplicationService
    {
        Task<PagedResultDto<GetEmployeeRecordOutput>> GetAccountsAbility(GetEmployeeRecordListInput input);
        Task CreateEmployeeRecord(CreateEmployeeRecords input);
        Task UpdateEmployeeRecord(UpdateEmployeeRecords input);
        Task DeleteEmployeeRecord(DeleteEmployeeRecords input);

    }
}
