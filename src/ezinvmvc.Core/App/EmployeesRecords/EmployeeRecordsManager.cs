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
    public class EmployeeRecordsManager : DomainService, IEmployeeRecordsManager
    {
        private readonly IRepository<EmployeeRecords> _repositoryEmployeeRecords;
        private readonly IDapperRepository<EmployeeRecords> _repositoryEmployeeRecordsDapper;

        public EmployeeRecordsManager(IRepository<EmployeeRecords> repository, IDapperRepository<EmployeeRecords> repositoryDapper)
        {
            _repositoryEmployeeRecords = repository;
            _repositoryEmployeeRecordsDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateEmployeesRecordsAsync(EmployeeRecords entity)
        {
            var result = _repositoryEmployeeRecords.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployeeRecords.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteEmployeesRecordsAsync(int id)
        {
            var result = _repositoryEmployeeRecords.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryEmployeeRecords.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<EmployeeRecords>> GetAllEmployeesRecordsAsync(string filter)
        {
            string wc = " Where isdeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (EmpId = @Filter) ";
            }
            //string sort = "";
            //if (sorting.Trim().Length > 0)
            //{
            //    sort = " order by DateIssue asc ";
            //}
            var dp = new DynamicParameters();
            dp.Add("@Filter", filter);
            try
            {
                IEnumerable<EmployeeRecords> getAll = await _repositoryEmployeeRecordsDapper.QueryAsync<EmployeeRecords>("Select * from appEmployeeRecords " + wc, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<EmployeeRecords> GetEmployeesRecordsByIdAsync(int id)
        {
            var result = _repositoryEmployeeRecords.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryEmployeeRecords.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateEmployeesRecordsAsync(EmployeeRecords entity)
        {
            try
            {
                await _repositoryEmployeeRecords.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

    }
    
}
