using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Employees.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public class DivEmployeeManager : DomainService, IDivEmployeeManager
    {
        private readonly IRepository<DivEmployee> _repositoryDivEmployee;
        private readonly IDapperRepository<DivEmployee> _repositoryDivEmployeeDapper;

        public DivEmployeeManager(IRepository<DivEmployee> repository, IDapperRepository<DivEmployee> repositoryDapper)
        {
            _repositoryDivEmployee = repository;
            _repositoryDivEmployeeDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateDivEmployeeAsync(DivEmployee entity)
        {
            var result = _repositoryDivEmployee.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryDivEmployee.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteDivEmployeeAsync(int id)
        {
            var result = _repositoryDivEmployee.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryDivEmployee.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<DivEmployee>> GetAllDivEmployee()
        {
            return await _repositoryDivEmployee.GetAllListAsync();
        }

        public async Task<IEnumerable<DivEmployee>> GetAllDivEmployeeList(string filter, string sorting)
        {
            string wc = " Where isdeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (Name like @Filter) ";
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                sort = " order by Ids asc ";
            }
            var dp = new DynamicParameters();
            dp.Add("@Filter", "%" + filter + "%");
            try
            {
                IEnumerable<DivEmployee> getAll = await _repositoryDivEmployeeDapper.QueryAsync<DivEmployee>("Select * from AppDivEmployee " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<DivEmployee> GetDivEmployeeByIdAsync(int id)
        {
            var result = _repositoryDivEmployee.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryDivEmployee.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateDivEmployeeAsync(DivEmployee entity)
        {
            try
            {
                await _repositoryDivEmployee.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
