using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public class PayrollOtherLoanManager : DomainService, IPayrollOtherLoanManager
    {
        private readonly IRepository<PayrollOtherLoan> _repository;
        private readonly IDapperRepository<PayrollOtherLoan> _repositoryDapper;

        public PayrollOtherLoanManager(IRepository<PayrollOtherLoan> repository, IDapperRepository<PayrollOtherLoan> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(PayrollOtherLoan entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repository.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repository.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repository.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<PayrollOtherLoan> GetbyIdAsync(int id)
        {
            var result = _repository.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repository.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<PayrollOtherLoan>> GetListAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string attId = "";
            string EmpId = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    attId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    EmpId = tokens[1].ToString();
                }
            }

            string wc = " where a.Isdeleted = 0 ";

            string wc2 = " ";
            var dp = new DynamicParameters();
            if (attId != "")
            {
                wc = wc + " and a.AttId = @attId ";
                wc2 = wc2 + " and AttId = @attId ";
                dp.Add("@attId", attId);
            }
            if (EmpId != "")
            {
                wc = wc + " and a.EmpId = @EmpId ";
                dp.Add("@EmpId", EmpId);
            }
            string sort = " ";
            try

            {
                IEnumerable<PayrollOtherLoan> getAll = await _repositoryDapper.QueryAsync<PayrollOtherLoan>("   select c.id,c.AttId,c.EmpId,a.AppNo,d.LoanTitleName +'/'+ e.LoanTypeName as description,b.LoanAmount,b.LoanAmount-c.bal as Balance,a.Amount from AppPayrollOtherLoan as a with (nolock) inner join appEmployeeLoans as b with (nolock) on a.AppNo = b.ApplicationNo inner join (select sum (Amount)as bal,Id,AppNo,EmpId,AttId from AppPayrollOtherLoan with (nolock) where IsDeleted = 0 " + wc2 + " group by  Id,AppNo,EmpId,AttId)  as c on b.ApplicationNo = c.AppNo inner join appLoanTitle  as d with (nolock) on b.LoanTitle = d.id inner join appLoanType  as e with (nolock) on b.LoanType = e.id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(PayrollOtherLoan entity)
        {
            try
            {
                await _repository.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<PayrollOtherLoan>> UpdateDelete(string filter)
        {
            string[] tokens = filter.Split('|');
            string attId = "";
            string EmpId = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    attId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    EmpId = tokens[1].ToString();
                }
            }

            string wc = " where Isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (attId != "")
            {
                wc = wc + " and attId = @attId ";
                dp.Add("@attId", attId);
            }
            if (EmpId != "")
            {
                wc = wc + " and EmpId = @EmpId ";
                dp.Add("@EmpId", EmpId);
            }


            string sort = " ";
            try
            {
                IEnumerable<PayrollOtherLoan> getAll = await _repositoryDapper.QueryAsync<PayrollOtherLoan>("update AppPayrollOtherLoan set IsDeleted = 1 , Status='InActive'  " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
