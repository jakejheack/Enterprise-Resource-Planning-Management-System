using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Employees
{
    public class DepartmentManager : DomainService, IDepartmentManager
    {
        private readonly IRepository<Department> _repositoryDepartment;
        private readonly IDapperRepository<Department> _repositoryDepartmenteDapper;

        public DepartmentManager(IRepository<Department> repository, IDapperRepository<Department> repositoryDapper)
        {
            _repositoryDepartment = repository;
            _repositoryDepartmenteDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateDepartmentAsync(Department entity)
        {
            var result = _repositoryDepartment.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryDepartment.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteDepartmentAsync(int id)
        {
            var result = _repositoryDepartment.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryDepartment.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Department>> GetAllDepartment()
        {
            return await _repositoryDepartment.GetAllListAsync();
        }

        public async Task<IEnumerable<Department>> GetAllDepartmentList(string filter, string sorting)
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
                IEnumerable<Department> getAll = await _repositoryDepartmenteDapper.QueryAsync<Department>("Select * from AppDepartment " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Department> GetDepartmentByIdAsync(int id)
        {
            var result = _repositoryDepartment.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryDepartment.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateDepartmentAsync(Department entity)
        {
            try
            {
                await _repositoryDepartment.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
