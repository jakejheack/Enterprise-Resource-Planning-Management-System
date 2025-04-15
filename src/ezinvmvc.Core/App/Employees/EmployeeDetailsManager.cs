using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public class EmployeeDetailsManager : DomainService, IEmployeeDetailsManager
    {
        private readonly IRepository<EmployeeDetails> _repositoryEmployeeDetails;
        private readonly IDapperRepository<EmployeeDetails> _repositoryEmployeeDapper;

        public EmployeeDetailsManager(IRepository<EmployeeDetails> repository, IDapperRepository<EmployeeDetails> repositoryDapper)
        {
            _repositoryEmployeeDetails = repository;
            _repositoryEmployeeDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(EmployeeDetails entity)
        {
            var result = _repositoryEmployeeDetails.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployeeDetails.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }
        
        public async Task<EmployeeDetails> GetByIdAsync(int id)
        {
            var result = _repositoryEmployeeDetails.FirstOrDefault(x => x.EmployeeId == id);
            if (result != null)
            {
                return await _repositoryEmployeeDetails.GetAsync(id);
            }
            else
            {
                //throw new UserFriendlyException("No Data Found!");
                return new EmployeeDetails();
            }
        }

        public async Task<IdentityResult> UpdateAsync(EmployeeDetails entity)
        {
            try
            {
                await _repositoryEmployeeDetails.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeDetails>> GetDetailId(int EmpId)
        {
            string wc = " Where EmployeeId = " + EmpId + " ";

            string sort = " order by Name ASC";
            var dp = new DynamicParameters();
            try
            {
                var getAll = await _repositoryEmployeeDapper.QueryAsync<EmployeeDetails>("Select * from AppEmployeeDetails " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
