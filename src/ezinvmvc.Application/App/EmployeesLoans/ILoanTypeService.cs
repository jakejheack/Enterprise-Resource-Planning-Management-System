using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.EmployeesLoans.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public interface ILoanTypeService : IApplicationService
    {
        Task CreateLoanTypeAsync(CreateLoanTypeInput input);

        Task<PagedResultDto<GetLoanTypeOutput>> GetLoanTypeIdAsync(GetLoanTypeInput input);
    }
}
