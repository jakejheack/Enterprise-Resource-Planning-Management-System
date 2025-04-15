using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeeOvertimeRates.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeeOvertimeRates
{
    public class EmployeeOTRateManager : DomainService, IEmployeeOTRateManager
    {
        private readonly IRepository<EmployeeOTRates> _repositoryEmployeeOTRates;
        private readonly IDapperRepository<EmployeeOTRates> _repositoryEmployeeOTRatesDapper;

        public EmployeeOTRateManager(IRepository<EmployeeOTRates> repository, IDapperRepository<EmployeeOTRates> repositoryDapper)
        {
            _repositoryEmployeeOTRates = repository;
            _repositoryEmployeeOTRatesDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateEmployeeOTRatesAsync(EmployeeOTRates entity)
        {
            var result = _repositoryEmployeeOTRates.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployeeOTRates.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<EmployeeOTRates> GetTop1EmployeeOTRatesAsync(int empId)
        {
            string wc = " Where a.IsDeleted = 0 And (a.EmpId = @Filter) and a.status = 'Active' ";
            string sort = " order by a.Id desc ";
            var dp = new DynamicParameters();
            dp.Add("@Filter", empId);
            try
            {
                IEnumerable<EmployeeOTRates> getAll = await _repositoryEmployeeOTRatesDapper.QueryAsync<EmployeeOTRates>("select top 1 a.*,b.FirstName +' '+ b.MiddleName +' '+ b.LastName as FullName, c.* from appEmployeeOTRates as a inner join appEmployee as b on a.EmpId = b.Id inner join AppOvertimeRate as c on a.TabId = c.Id " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeOTRates>>GetAllEmployeeOTRatesAsync(string filter)
        {
            string wc = " Where a.IsDeleted = 0 And (a.EmpId = @Filter) ";
            string sort = " order by a.Id desc ";
            var dp = new DynamicParameters();
            dp.Add("@Filter", filter);
            try
            {
                IEnumerable<EmployeeOTRates> getAll = await _repositoryEmployeeOTRatesDapper.QueryAsync<EmployeeOTRates>("select a.*,b.FirstName +' '+ b.MiddleName +' '+ b.LastName as FullName, c.TableName from appEmployeeOTRates as a inner join appEmployee as b on a.EmpId = b.Id inner join AppOvertimeRate as c on a.TabId = c.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public Task<IdentityResult> UpdateEmployeeOTRatesAsync(EmployeeOTRates entity)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<EmployeeOTRates>> UpdateEmployeeOTRatesByIdAsync(int empId)
        {
            throw new NotImplementedException();
        }

        public async Task<IdentityResult> DeleteEmployeeOTRatesAsync(int id)
        {
            var result = _repositoryEmployeeOTRates.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryEmployeeOTRates.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<EmployeeOTRates> UpdateAllEmployeeOTRatesAsync(int empId)
        {
            string wc = " Where IsDeleted = 0 And (EmpId = @empId) ";
            var dp = new DynamicParameters();
            dp.Add("@empId", empId);
            try
            {
                IEnumerable<EmployeeOTRates> getAll = await _repositoryEmployeeOTRatesDapper.QueryAsync<EmployeeOTRates>("update appEmployeeOTRates set status = 'InActive' " + wc , dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
