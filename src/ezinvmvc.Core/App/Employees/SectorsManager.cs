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
    public class SectorsManager : DomainService, ISectorsManager
    {
        private readonly IRepository<Sectors> _repositorySectors;
        private readonly IDapperRepository<Sectors> _repositorySectorsDapper;

        public SectorsManager(IRepository<Sectors> repository, IDapperRepository<Sectors> repositoryDapper)
        {
            _repositorySectors = repository;
            _repositorySectorsDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateSectorsAsync(Sectors entity)
        {
            var result = _repositorySectors.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositorySectors.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteSectorsAsync(int id)
        {
            var result = _repositorySectors.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositorySectors.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Sectors>> GetAllSectors()
        {
            return await _repositorySectors.GetAllListAsync();
        }

        public async Task<IEnumerable<Sectors>> GetAllSectorsList(string filter, string sorting)
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
                IEnumerable<Sectors> getAll = await _repositorySectorsDapper.QueryAsync<Sectors>("Select * from AppSectors " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Sectors> GetSectorsByIdAsync(int id)
        {
            var result = _repositorySectors.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositorySectors.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateSectorsAsync(Sectors entity)
        {
            try
            {
                await _repositorySectors.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

    }
}
