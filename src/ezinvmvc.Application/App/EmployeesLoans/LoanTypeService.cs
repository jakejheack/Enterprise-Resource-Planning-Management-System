using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeesLoans.Dto;
using ezinvmvc.App.EmployeesLoans.Models;

namespace ezinvmvc.App.EmployeesLoans
{
    public class LoanTypeService : ezinvmvcAppServiceBase, ILoanTypeService
    {
        private readonly ILoanTypeManager _Manager;

        public LoanTypeService(ILoanTypeManager loanTypeManager)
        {
            _Manager = loanTypeManager;
        }

        public async Task CreateLoanTypeAsync(CreateLoanTypeInput input)
        {
            LoanType output = Mapper.Map<LoanType>(input);

            CheckErrors(await _Manager.CreateLoanTypeAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<PagedResultDto<GetLoanTypeOutput>> GetLoanTypeIdAsync(GetLoanTypeInput input)
        {
            var resultList = await _Manager.GetLoanTypeIdAsync(input.LoanTitleId);
            int listcount = 0;
            return new PagedResultDto<GetLoanTypeOutput>(listcount, ObjectMapper.Map<List<GetLoanTypeOutput>>(resultList));
        }
    }
}
