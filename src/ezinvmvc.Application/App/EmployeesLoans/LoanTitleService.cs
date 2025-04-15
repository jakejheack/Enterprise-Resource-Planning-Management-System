using Abp.Application.Services;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeesLoans.Dto;
using ezinvmvc.App.EmployeesLoans.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public class LoanTitleService : ezinvmvcAppServiceBase, ILoanTitleService
    {
        private readonly ILoanTitleManager _Manager;

        public LoanTitleService(ILoanTitleManager loanTitleManager)
        {
            _Manager = loanTitleManager;
        }

        public async Task CreateLoanTitlesAsync(CreateLoanTitleInput input)
        {
            LoanTitle output = Mapper.Map<LoanTitle>(input);

            CheckErrors(await _Manager.CreateLoanTitleAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<PagedResultDto<GetLoanTitleOutput>> GetLoanTitleAsync()
        {
            var resultList = await _Manager.GetLoanTitleIdAsync();
            int listcount = 0;
            return new PagedResultDto<GetLoanTitleOutput>(listcount, ObjectMapper.Map<List<GetLoanTitleOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetLoanTitleOutput>> GetLoanTitleDedAsync()
        {
            var resultList = await _Manager.GetLoanTitleIdDedAsync();
            int listcount = 0;
            return new PagedResultDto<GetLoanTitleOutput>(listcount, ObjectMapper.Map<List<GetLoanTitleOutput>>(resultList));
        }
    }
}
