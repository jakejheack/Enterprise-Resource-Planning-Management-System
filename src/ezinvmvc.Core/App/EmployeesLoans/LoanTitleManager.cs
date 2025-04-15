using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeesLoans.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public class LoanTitleManager : DomainService, ILoanTitleManager
    {
        private readonly IRepository<LoanTitle> _repositoryLoanTitle;
        private readonly IDapperRepository<LoanTitle> _repositoryLoanTitleDapper;

        public LoanTitleManager(IRepository<LoanTitle> repository, IDapperRepository<LoanTitle> repositoryDapper)
        {
            _repositoryLoanTitle = repository;
            _repositoryLoanTitleDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateLoanTitleAsync(LoanTitle entity)
        {
            var result = _repositoryLoanTitle.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryLoanTitle.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IEnumerable<LoanTitle>> GetLoanTitleIdAsync()
        {
            string wc = " Where IsDeleted = 0 and id not in (3)";
            string sort = " order by Id asc ";
            var dp = new DynamicParameters();
            try
            {
                IEnumerable<LoanTitle> getAll = await _repositoryLoanTitleDapper.QueryAsync<LoanTitle>("select * from appLoanTitle " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<LoanTitle>> GetLoanTitleIdDedAsync()
        {
            string wc = " Where IsDeleted = 0 and Id = 3 ";
            string sort = " order by Id asc ";
            var dp = new DynamicParameters();
            try
            {
                IEnumerable<LoanTitle> getAll = await _repositoryLoanTitleDapper.QueryAsync<LoanTitle>("select * from appLoanTitle " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
