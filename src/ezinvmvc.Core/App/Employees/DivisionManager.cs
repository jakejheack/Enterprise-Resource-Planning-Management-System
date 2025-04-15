using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Employees.Models;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Employees
{
    public class DivisionManager : DomainService, IDivsionManager
    {
        private readonly IRepository<Division> _repositoryDivision;
        private readonly IDapperRepository<Division> _repositoryDivisionDapper;

        public DivisionManager(IRepository<Division> repository, IDapperRepository<Division> repositoryDapper)
        {
            _repositoryDivision = repository;
            _repositoryDivisionDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateDivisionAsync(Division entity)
        {
            var result = _repositoryDivision.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryDivision.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteDivisionAsync(int id)
        {
            var result = _repositoryDivision.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryDivision.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Division>> GetAllDivisionList(string filter, string sorting)
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
                IEnumerable<Division> getAll = await _repositoryDivisionDapper.QueryAsync<Division>("Select * from AppDivision " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Division>> GetAllDivisions()
        {
            return await _repositoryDivision.GetAllListAsync();
        }

        public async Task<Division> GetDivisionByIdAsync(int id)
        {
            var result = _repositoryDivision.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryDivision.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateDivisionAsync(Division entity)
        {
            try
            {
                await _repositoryDivision.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
