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
    public class LoanTypeManager : DomainService, ILoanTypeManager
    {
        private readonly IRepository<LoanType> _repositoryLoanType;
        private readonly IDapperRepository<LoanType> _repositoryLoanTypeDapper;


        public LoanTypeManager(IRepository<LoanType> repository, IDapperRepository<LoanType> repositoryDapper)
        {
            _repositoryLoanType = repository;
            _repositoryLoanTypeDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateLoanTypeAsync(LoanType entity)
        {
            var result = _repositoryLoanType.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryLoanType.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IEnumerable<LoanType>> GetLoanTypeIdAsync(int TitleId)
        {
            string wc = " Where IsDeleted = 0 And (LoanTitleId = @TitleId)";
            string sort = " order by Id asc";
            var dp = new DynamicParameters();
            dp.Add("@TitleId", TitleId);
            try
            {
                IEnumerable<LoanType> getAll = await _repositoryLoanTypeDapper.QueryAsync<LoanType>("select * from appLoanType " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
