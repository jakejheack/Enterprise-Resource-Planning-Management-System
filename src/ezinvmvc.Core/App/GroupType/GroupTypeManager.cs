using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.GroupTypes
{
    public class GroupTypeManager : DomainService, IGroupTypeManager
    {
        private readonly IRepository<GroupType> _repositoryGroupType;
        private readonly IDapperRepository<GroupType> _repositoryGroupTypeDapper;

        public GroupTypeManager(IRepository<GroupType> repository, IDapperRepository<GroupType> repositoryDapper)
        {
            _repositoryGroupType = repository;
            _repositoryGroupTypeDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(GroupType entity)
        {
            var result = _repositoryGroupType.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryGroupType.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryGroupType.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryGroupType.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<GroupType>> GetAllList(string filter, string sorting)
        {
            string wc = " Where isdeleted = 0 ";
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And (GroupTypes like @Filter) ";
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
                    IEnumerable<GroupType> getAll = await _repositoryGroupTypeDapper.QueryAsync<GroupType>("Select * from AppGroupType " + wc + sort, dp);
                    return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<GroupType> GetByIdAsync(int id)
        {
            var result = _repositoryGroupType.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryGroupType.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(GroupType entity)
        {
            try
            {
                await _repositoryGroupType.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<GroupType>> GetAll()
        {
            return await _repositoryGroupType.GetAllListAsync();
        }
    }
}
