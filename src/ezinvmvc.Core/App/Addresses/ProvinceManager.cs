using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Addresses.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public class ProvinceManager : DomainService, IProvinceManager
    {
        private readonly IRepository<Province> _repositoryProvince;
        private readonly IDapperRepository<City> _repositoryCityDapper;
        public ProvinceManager(IRepository<Province> repositoryProvince, IDapperRepository<City> repositoryCityDapper)
        {
            _repositoryProvince = repositoryProvince;
            _repositoryCityDapper = repositoryCityDapper;
        }

        public async Task<IdentityResult> CreateAsync(Province entity)
        {
            var result = _repositoryProvince.FirstOrDefault(x => x.Name == entity.Name);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryProvince.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryProvince.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryProvince.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Province>> GetAllList()
        {
            return await _repositoryProvince.GetAllListAsync();
        }

        public async Task<Province> GetByIdAsync(int id)
        {
            var result = _repositoryProvince.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryProvince.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(Province entity)
        {
            try
            {
                await _repositoryProvince.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<City>> GetCities(int countryid)
        {

            string wc = " where provinceid = " + countryid + " ";

            string sort = " order by Name ASC";
            var dp = new DynamicParameters();
            try
            {
                var getAll = await _repositoryCityDapper.QueryAsync<City>("Select appcities.* from appcities " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
