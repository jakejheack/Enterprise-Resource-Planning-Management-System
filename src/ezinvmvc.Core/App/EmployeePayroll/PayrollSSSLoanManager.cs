using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public class PayrollSSSLoanManager : DomainService, IPayrollSSSLoanManager
    {
        private readonly IRepository<PayrollSSSLoan> _repository;
        private readonly IDapperRepository<PayrollSSSLoan> _repositoryDapper;

        public PayrollSSSLoanManager(IRepository<PayrollSSSLoan> repository, IDapperRepository<PayrollSSSLoan> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(PayrollSSSLoan entity)
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

        public async Task<PayrollSSSLoan> GetbyIdAsync(int id)
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

        public async Task<IEnumerable<PayrollSSSLoan>> GetListAsync(string filter)
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
                wc = wc + " and c.AttId = @attId ";
                wc2 = wc2 + " and AttId = @attId ";

                dp.Add("@attId", attId);
            }
            if (EmpId != "")
            {
                wc = wc + " and c.EmpId = @EmpId ";
                dp.Add("@EmpId", EmpId);
            }
            string sort = " ";
            try

            {
                IEnumerable<PayrollSSSLoan> getAll = await _repositoryDapper.QueryAsync<PayrollSSSLoan>("select c.id,c.AttId,c.EmpId,a.AppNo,d.LoanTitleName +'/'+ e.LoanTypeName as description,b.LoanAmount,b.LoanAmount-c.bal as Balance,a.Amount from AppPayrollSSSLoan as a with (nolock) inner join appEmployeeLoans as b with (nolock) on a.AppNo = b.ApplicationNo inner join (select sum (Amount)as bal,Id,AppNo,EmpId,AttId from AppPayrollSSSLoan with (nolock) where IsDeleted = 0 " + wc2 + " group by Id,AppNo,EmpId,AttId)  as c on b.ApplicationNo = c.AppNo inner join appLoanTitle  as d with (nolock) on b.LoanTitle = d.id inner join appLoanType  as e with (nolock) on b.LoanType = e.id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(PayrollSSSLoan entity)
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

        public async Task<IEnumerable<PayrollSSSLoan>> UpdateDelete(string filter)
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
                IEnumerable<PayrollSSSLoan> getAll = await _repositoryDapper.QueryAsync<PayrollSSSLoan>("update AppPayrollSSSLoan set IsDeleted = 1  , Status='InActive' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<PayrollSSSLoan>> GetSSSLoanCollectionListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');
            string attid = "";
            string comp = "";
            string dept = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    attid = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    comp = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }

            string wc = " where a.IsDeleted = 0 and a.Status = 'Active' ";
            var dp = new DynamicParameters();

            if (attid != "" && attid != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where a.AttId = @attid  ";
                }
                else
                {
                    wc = wc + " and a.AttId = @attid ";
                }
                dp.Add("@attid", attid);
            }
            if (comp != "" && comp != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where c.Id = @comp ";
                }
                else
                {
                    wc = wc + " and c.Id = @comp ";
                }
                dp.Add("@comp", comp);
            }
            if (dept != "" && dept != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where d.Id = @dept ";
                }
                else
                {
                    wc = wc + " and d.Id = @dept ";
                }
                dp.Add("@dept", dept);
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " " + lastWord;
            }
            else
            {
                sort = " order by Status2 asc ";
            }
            try
            {
                if (!forexport)
                {
                    IEnumerable<PayrollSSSLoan> getAll = await _repositoryDapper.QueryAsync<PayrollSSSLoan>(" select count(*) Over() TotalRows, a.IsDeleted,a.EmpId,a.AttId,a.AppNo,a.Description,a.LoanAmount,a.Amount,a.Status,b.LastName +', '+ b.FirstName as Description1, b.EmployeeCode as Description2,b.SSS as Description3,c.Name as Status1,d.Name as Status2 from AppPayrollSSSLoan as a inner join AppEmployee as b on a.EmpId = b.id inner join AppSectors as c on b.SectorsId = c.id inner join AppDepartment as d on b.DepartmentId = d.id " + wc + sort, dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<PayrollSSSLoan> getAll = await _repositoryDapper.QueryAsync<PayrollSSSLoan>(" select count(*) Over() TotalRows, a.IsDeleted,a.EmpId,a.AttId,a.AppNo,a.Description,a.LoanAmount,a.Amount,a.Status,b.LastName +', '+ b.FirstName as Description1, b.EmployeeCode as Description2,b.SSS as Description3,c.Name as Status1,d.Name as Status2 from AppPayrollSSSLoan as a inner join AppEmployee as b on a.EmpId = b.id inner join AppSectors as c on b.SectorsId = c.id inner join AppDepartment as d on b.DepartmentId = d.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
