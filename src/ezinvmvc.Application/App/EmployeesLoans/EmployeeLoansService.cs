using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeesLoans.Dto;
using ezinvmvc.App.EmployeesLoans.Models;

namespace ezinvmvc.App.EmployeesLoans
{
    public class EmployeeLoansService : ezinvmvcAppServiceBase, IEmployeeLoansService
    {
        private readonly IEmployeeLoansManager _Manager;

        public EmployeeLoansService(IEmployeeLoansManager employeeLoansManager)
        {
            _Manager = employeeLoansManager;
        }

        public async Task CreateEmployeeLoansAsync(CreateEmployeeLoansInput input)
        {
            EmployeeLoans output = Mapper.Map<EmployeeLoans>(input);

            CheckErrors(await _Manager.CreateEmployeeLoansAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeLoansAsync(DeleteEmployeeLoansInput input)
        {
            CheckErrors(await _Manager.DeleteEmployeeLoansAsync(input.Id));
        }

        public async Task UpdateEmployeeLoansAsync(UpdateEmployeeLoansInput input)
        {
            EmployeeLoans output = Mapper.Map<UpdateEmployeeLoansInput, EmployeeLoans>(input);
            CheckErrors(await _Manager.UpdateEmployeeLoansAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetAllEmployeeLoansAsync(GetEmployeeLoansListInput input)
        {
            var resultList = await _Manager.GetAllEmployeeLoansAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmployeeLoansById(GetEmployeeLoansInput input)
        {
            var resultList = await _Manager.GetEmployeeLoansIdAsync(input.Id);
            int listcount = 0;
            var output = new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmployeeDetailsAsync(GetEmployeeLoansInput input)
        {
            var resultList = await _Manager.GetEmployeeDetailAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetLoanListAsync(GetEmployeeLoansListInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _Manager.GetLoanListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> ForceClosedById(GetEmployeeLoansInput input)
        {
            var resultList = await _Manager.ForceclosedloanAsync(input.Id);
            int listcount = 0;
            var output = new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanListAsync(GetEmployeeLoansListInput input)
        {
            input.MaxResultCount = 10;
            var resultList = await _Manager.GetEmpLoanListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanSSSAsync(GetEmployeeLoansListInput input)
        {
            var resultList = await _Manager.GetEmpLoanSSSAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanPgbAsync(GetEmployeeLoansListInput input)
        {
            var resultList = await _Manager.GetEmpLoanPgbAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanPgbListAsync(GetEmployeeLoansListInput input)
        {
            var resultList = await _Manager.GetEmpLoanPgbListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanOthAsync(GetEmployeeLoansListInput input)
        {
            var resultList = await _Manager.GetEmpLoanOthAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanOthListAsync(GetEmployeeLoansListInput input)
        {
            var resultList = await _Manager.GetEmpLoanOthListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetSummaryLoanReportListAsync(GetEmployeeLoansListInput input)
        {
            //input.MaxResultCount = 10;
            var resultList = await _Manager.GetLoanSummaryReportListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanSSSListAsync(GetEmployeeLoansListInput input)
        {
            var resultList = await _Manager.GetEmpLoanSSSListAsync(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmployeeLoansOutput>> GetEmpLoanListCertAsync(GetEmployeeLoansListInput input)
        {
            input.MaxResultCount = 10;
            var resultList = await _Manager.GetEmpLoanCertListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmployeeLoansOutput>(listcount, ObjectMapper.Map<List<GetEmployeeLoansOutput>>(resultList));
        }

    }
}
