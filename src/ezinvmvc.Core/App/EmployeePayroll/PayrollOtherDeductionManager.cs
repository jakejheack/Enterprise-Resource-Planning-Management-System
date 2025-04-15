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
    public class PayrollOtherDeductionManager : DomainService, IPayrollOtherDeductionManager
    {
        private readonly IRepository<PayrollOtherDeduction> _repository;
        private readonly IDapperRepository<PayrollOtherDeduction> _repositoryDapper;

        public PayrollOtherDeductionManager(IRepository<PayrollOtherDeduction> repository, IDapperRepository<PayrollOtherDeduction> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(PayrollOtherDeduction entity)
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

        public async Task<PayrollOtherDeduction> GetbyIdAsync(int id)
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

        public async Task<IEnumerable<PayrollOtherDeduction>> GetListAsync(string filter)
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


            string sort = "  order by [Index] asc";
            try
            {
                IEnumerable<PayrollOtherDeduction> getAll = await _repositoryDapper.QueryAsync<PayrollOtherDeduction>("select * from AppPayrollOtherDeduction " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(PayrollOtherDeduction entity)
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
        public async Task<IEnumerable<PayrollOtherDeduction>> UpdateDelete(string filter)
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
                IEnumerable<PayrollOtherDeduction> getAll = await _repositoryDapper.QueryAsync<PayrollOtherDeduction>("update AppPayrollOtherDeduction set IsDeleted = 1 , Status='InActive'  " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
