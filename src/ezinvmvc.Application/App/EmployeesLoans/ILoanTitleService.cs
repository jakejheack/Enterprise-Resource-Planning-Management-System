using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesLoans.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public interface ILoanTitleService : IApplicationService
    {
        Task CreateLoanTitlesAsync(CreateLoanTitleInput input);

        Task<PagedResultDto<GetLoanTitleOutput>> GetLoanTitleAsync();

        Task<PagedResultDto<GetLoanTitleOutput>> GetLoanTitleDedAsync();
    }
}
