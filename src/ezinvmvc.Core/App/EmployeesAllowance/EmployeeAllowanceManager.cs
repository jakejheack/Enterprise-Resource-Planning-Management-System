using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeesAllowance.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesAllowance
{
    public class EmployeeAllowanceManager : DomainService, IEmployeeAllowanceManager
    {
        private readonly IRepository<EmployeeAllowances> _repositoryEmployeeAllowances;
        private readonly IDapperRepository<EmployeeAllowances> _repositoryEmployeeAllowancesDapper;

        public EmployeeAllowanceManager(IRepository<EmployeeAllowances> repository, IDapperRepository<EmployeeAllowances> repositoryDapper)
        {
            _repositoryEmployeeAllowances = repository;
            _repositoryEmployeeAllowancesDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateEmployeeAllowancesAsync(EmployeeAllowances entity)
        {
            var result = _repositoryEmployeeAllowances.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployeeAllowances.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteEmployeeAllowancesAsync(int id)
        {
            var result = _repositoryEmployeeAllowances.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryEmployeeAllowances.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<EmployeeAllowances>> GetAllEmployeeAllowancesAsync(string filter)
        {
            string wc = " Where a.IsDeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (a.EmpId = @Filter) ";
            }
            string sort = " order by a.Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Filter", filter);
            try
            {
                IEnumerable<EmployeeAllowances> getAll = await _repositoryEmployeeAllowancesDapper.QueryAsync<EmployeeAllowances>("select a.*,b.EmployeeCode,b.FirstName +' '+ b.MiddleName +' '+ b.LastName as FullName,d.Status as AllowanceP from appEmployeeAllowances as a left outer join appEmployee as b on a.EmpId = b.Id left outer join AppHRStatusTypes as d on a.Period = d.id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeAllowances>> GetAllTop1EmployeeAllowancesAsync(int empId)
        {
            string wc = " Where a.IsDeleted = 0 And (a.EmpId = @Filter) and a.status = 'Active' and SYSDATETIME() between a.StartDate and a.EndDate ";
            string sort = " order by a.Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Filter", empId);
            try
            {
                IEnumerable<EmployeeAllowances> getAll = await _repositoryEmployeeAllowancesDapper.QueryAsync<EmployeeAllowances>("select * from appEmployeeAllowances as a inner join appEmployee as b on a.Empid = b.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<EmployeeAllowances> GetEmployeeAllowancesByIdAsync(int id)
        {
            var result = _repositoryEmployeeAllowances.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryEmployeeAllowances.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<EmployeeAllowances>> GetTop1EmpAllowancesAsync(int empId)
        {
            string wc = " Where a.IsDeleted = 0 And (a.EmpId = @Filter) and a.status = 'Active' and a.taxable = 1 ";
            string sort = " ";
            var dp = new DynamicParameters();
            dp.Add("@Filter", empId);
            try
            {
                IEnumerable<EmployeeAllowances> getAll = await _repositoryEmployeeAllowancesDapper.QueryAsync<EmployeeAllowances>(" select CASE WHEN a.Period = 1 THEN a.Amount/1 WHEN a.Period = 2 THEN a.Amount/3  WHEN a.Period = 3 THEN a.Amount/2 WHEN a.Period = 4 THEN a.Amount/1 END as EmpAllowance, a.* from appEmployeeAllowances as a inner join appEmployee as b on a.Empid = b.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeAllowances>> GetNonTaxEmpAllowancesAsync(int empId)
        {
            string wc = " Where a.IsDeleted = 0 And (a.EmpId = @Filter) and a.status = 'Active' and a.taxable = 0 ";
            string sort = " ";
            var dp = new DynamicParameters();
            dp.Add("@Filter", empId);
            try
            {
                IEnumerable<EmployeeAllowances> getAll = await _repositoryEmployeeAllowancesDapper.QueryAsync<EmployeeAllowances>(" select CASE WHEN a.Period = 1 THEN a.Amount/1 WHEN a.Period = 2 THEN a.Amount/3  WHEN a.Period = 3 THEN a.Amount/2 WHEN a.Period = 4 THEN a.Amount/1 END as EmpAllowance, a.* from appEmployeeAllowances as a inner join appEmployee as b on a.Empid = b.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateEmployeeAllowancesAsync(EmployeeAllowances entity)
        {
            try
            {
                await _repositoryEmployeeAllowances.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeAllowances>> UpdateEmployeeAllowancesByIdAsync(int empId)
        {
            string wc = " Where IsDeleted = 0 And (EmpId = @Filter)";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Filter", empId);
            try
            {
                IEnumerable<EmployeeAllowances> getAll = await _repositoryEmployeeAllowancesDapper.QueryAsync<EmployeeAllowances>("Update appEmployeeAllowances set Status = 'InActive' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
