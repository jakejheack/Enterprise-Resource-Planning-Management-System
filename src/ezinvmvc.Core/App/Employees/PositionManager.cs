using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Employees.Models;
using ezinvmvc.App.GroupTypes;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Employees
{
    public class PositionManager : DomainService, IPositionManager
    {
        private readonly IRepository<Position> _repositoryPosition;
        private readonly IDapperRepository<Position> _repositoryPositionDapper;

        public PositionManager(IRepository<Position> repository, IDapperRepository<Position> repositoryDapper)
        {
            _repositoryPosition = repository;
            _repositoryPositionDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreatePositionAsync(Position entity)
        {
            var result = _repositoryPosition.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryPosition.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeletePositionAsync(int id)
        {
            var result = _repositoryPosition.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryPosition.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Position>> GetAllPositions()
        {
            return await _repositoryPosition.GetAllListAsync();
        }

        public async Task<IEnumerable<Position>> GetAllPositionsList(string filter, string sorting)
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
                IEnumerable<Position> getAll = await _repositoryPositionDapper.QueryAsync<Position>("Select * from AppPosition " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Position> GetPositiontByIdAsync(int id)
        {
            var result = _repositoryPosition.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryPosition.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdatePositionAsync(Position entity)
        {
            try
            {
                await _repositoryPosition.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
