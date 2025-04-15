using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeesRecords.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesRecords
{
    public class EmployeeLeavesManager : DomainService, IEmployeeLeavesManager
    {
        private readonly IRepository<EmployeeLeaves> _repositoryEmployeeLeaves;
        private readonly IDapperRepository<EmployeeLeaves> _repositoryEmployeeLeavesDapper;

        public EmployeeLeavesManager(IRepository<EmployeeLeaves> repository, IDapperRepository<EmployeeLeaves> repositoryDapper)
        {
            _repositoryEmployeeLeaves = repository;
            _repositoryEmployeeLeavesDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateEmployeeLeavesAsync(EmployeeLeaves entity)
        {
            var result = _repositoryEmployeeLeaves.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployeeLeaves.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteEmployeeLeavesAsync(int id)
        {
            var result = _repositoryEmployeeLeaves.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryEmployeeLeaves.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<EmployeeLeaves>> GetAllEmployeeLeavesAsync(string filter)
        {
            string wc = " Where isdeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (EmpId = @Filter) ";
            }
            var dp = new DynamicParameters();
            dp.Add("@Filter", filter);
            try
            {
                IEnumerable<EmployeeLeaves> getAll = await _repositoryEmployeeLeavesDapper.QueryAsync<EmployeeLeaves>("select Id,EmpId,Description,DateFrom,DateTo,Status from appEmployeeLeaves " + wc, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<EmployeeLeaves> GetEmployeeLeavesByIdAsync(int id)
        {
            var result = _repositoryEmployeeLeaves.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryEmployeeLeaves.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateEmployeeLeavesAsync(EmployeeLeaves entity)
        {
            try
            {
                await _repositoryEmployeeLeaves.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
