using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeesSalaryRate.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesSalaryRate
{
    public class EmployeeSalariesManager : DomainService, IEmployeeSalariesManager
    {
        private readonly IRepository<EmployeeSalaries> _repositoryEmployeeSalaries;
        private readonly IDapperRepository<EmployeeSalaries> _repositoryEmployeeSalariesDapper;

        public EmployeeSalariesManager(IRepository<EmployeeSalaries> repository, IDapperRepository<EmployeeSalaries> repositoryDapper)
        {
            _repositoryEmployeeSalaries = repository;
            _repositoryEmployeeSalariesDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateEmployeeSalariesAsync(EmployeeSalaries entity)
        {
            var result = _repositoryEmployeeSalaries.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployeeSalaries.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteEmployeeSalariesAsync(int id)
        {
            var result = _repositoryEmployeeSalaries.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryEmployeeSalaries.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<EmployeeSalaries>> GetAllEmployeeSalariesAsync(string filter)
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
                IEnumerable<EmployeeSalaries> getAll = await _repositoryEmployeeSalariesDapper.QueryAsync<EmployeeSalaries>("select a.*,b.EmployeeCode,b.FirstName + b.MiddleName + b.LastName as FullName,c.Status as PayrollP,d.Status as PayrollR,ISNULL(PayrollRatePerMonth, ISNULL(PayrollRatePerWeek, ISNULL(PayrollRatePerDay, ISNULL(PayrollRatePerHour, ISNULL(PayrollRatePerPiece, 0.00))))) as PayrollAmount from appEmployeeSalaries as a "
                + "left outer join appEmployee as b on a.EmpId = b.Id left outer join AppHRStatusTypes as c on a.PayrollPeriod = c.Id left outer join AppHRStatusTypes as d on a.PayrollRate = d.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeSalaries>> GetAllTop1EmployeeSalariesAsync(int empId)
        {
            string wc = " Where a.IsDeleted = 0 And (a.EmpId = @Filter) and a.status = 'Active' and SYSDATETIME() between a.StartDate and a.EndDate ";
            string sort = " order by a.Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Filter", empId);
            try
            {
                IEnumerable<EmployeeSalaries> getAll = await _repositoryEmployeeSalariesDapper.QueryAsync<EmployeeSalaries>("select top 1 a.*,b.Id,b.EmployeeCode,b.FirstName + b.MiddleName + b.LastName as FullName,c.Status as PayrollP,d.Status as PayrollR from appEmployeeSalaries as a "
                + "left outer join appEmployee as b on a.EmpId = b.Id left outer join AppHRStatusTypes as c on a.PayrollPeriod = c.id left outer join AppHRStatusTypes as d on a.PayrollRate = d.id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<EmployeeSalaries> GetEmployeeSalariesByIdAsync(int id)
        {
            var result = _repositoryEmployeeSalaries.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryEmployeeSalaries.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateEmployeeSalariesAsync(EmployeeSalaries entity)
        {
            try
            {
                await _repositoryEmployeeSalaries.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeSalaries>> GetTop1EmpSalariesAsync(int empId)
        {
            string wc = " Where a.IsDeleted = 0 And (a.EmpId = @Filter) and a.status = 'Active' and SYSDATETIME() between a.StartDate and a.EndDate ";
            string sort = " order by a.Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Filter", empId);
            try
            {
                IEnumerable<EmployeeSalaries> getAll = await _repositoryEmployeeSalariesDapper.QueryAsync<EmployeeSalaries>("select top 1 a.*,b.Id,b.EmployeeCode,b.FirstName + b.MiddleName + b.LastName as FullName,c.Status as PayrollP,d.Status as PayrollR,b.CivilStatus,e.Name as DeptName,e.id as DeptId from appEmployeeSalaries as a "
                + "left outer join appEmployee as b on a.EmpId = b.Id left outer join AppHRStatusTypes as c on a.PayrollPeriod = c.id left outer join AppHRStatusTypes as d on a.PayrollRate = d.id left outer join AppDepartment as e with (nolock) on e.Id = b.DepartmentId " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }


    }
}
