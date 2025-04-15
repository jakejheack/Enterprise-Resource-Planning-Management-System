using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.EmployeePayroll.Dto;
using ezinvmvc.App.EmployeePayroll.Models;

namespace ezinvmvc.App.EmployeePayroll
{
    public class PayrollSSSLoanServices : ezinvmvcAppServiceBase, IPayrollSSSLoanServices
    {
        private readonly IPayrollSSSLoanManager _Manager;

        public PayrollSSSLoanServices(IPayrollSSSLoanManager payrollSSSLoanServices)
        {
            _Manager = payrollSSSLoanServices;
        }

        public async Task CreateAsync(CreatePayrollSSSLoanInput input)
        {
            PayrollSSSLoan output = Mapper.Map<PayrollSSSLoan>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(DeletePayrollSSSLoanInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetPayrollSSSLoanOutput>> GetAllListAsync(GetEmpPayrollListInput input)
        {
            var resultList = await _Manager.GetListAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollSSSLoanOutput>(listcount, ObjectMapper.Map<List<GetPayrollSSSLoanOutput>>(resultList));

        }

        public async Task<GetPayrollSSSLoanOutput> GetByIdAsync(GetEmpPayrollInput input)
        {
            var getbyid = await _Manager.GetbyIdAsync(input.Id);
            return Mapper.Map<GetPayrollSSSLoanOutput>(getbyid);
        }

        public async Task UpdateAsync(UpdatePayrollSSSLoanInput input)
        {
            PayrollSSSLoan output = Mapper.Map<UpdatePayrollSSSLoanInput, PayrollSSSLoan>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task<PagedResultDto<GetPayrollSSSLoanOutput>> GetSSSLoanCollection(GetEmpPayrollListInput input)
        {
            //input.MaxResultCount = 10;
            var resultList = await _Manager.GetSSSLoanCollectionListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetPayrollSSSLoanOutput>(listcount, ObjectMapper.Map<List<GetPayrollSSSLoanOutput>>(resultList));
        }

    }
}
