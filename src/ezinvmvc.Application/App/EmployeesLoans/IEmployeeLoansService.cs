using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesLoans.Dto;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public interface IEmployeeLoansService : IApplicationService
    {

        Task CreateEmployeeLoansAsync(CreateEmployeeLoansInput input);

        Task UpdateEmployeeLoansAsync(UpdateEmployeeLoansInput input);

        Task DeleteEmployeeLoansAsync(DeleteEmployeeLoansInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmployeeLoansById(GetEmployeeLoansInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetAllEmployeeLoansAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmployeeDetailsAsync(GetEmployeeLoansInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetLoanListAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> ForceClosedById(GetEmployeeLoansInput input);
        
        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanListAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanSSSAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanPgbAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanPgbListAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanOthAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanOthListAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetSummaryLoanReportListAsync(GetEmployeeLoansListInput input);

        Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanListCertAsync(GetEmployeeLoansListInput input);

    }
}
