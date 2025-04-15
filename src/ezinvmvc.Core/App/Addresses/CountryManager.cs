using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Addresses.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public class CountryManager : DomainService, ICountryManager
    {
        private readonly IRepository<Country> _repositoryCountry;
        private readonly IDapperRepository<Province> _repositoryProvinceDapper;

        public CountryManager(IRepository<Country> repositoryCountry, IDapperRepository<Province> repositoryProvinceDapper)
        {
            _repositoryCountry = repositoryCountry;
            _repositoryProvinceDapper = repositoryProvinceDapper;
        }

        public async Task<IdentityResult> CreateAsync(Country entity)
        {
            var result = _repositoryCountry.FirstOrDefault(x => x.Name == entity.Name);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryCountry.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryCountry.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryCountry.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Country>> GetAllList()
        {
            return await _repositoryCountry.GetAllListAsync();
        }

        public async Task<Country> GetByIdAsync(int id)
        {
            var result = _repositoryCountry.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryCountry.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(Country entity)
        {
            try
            {
                await _repositoryCountry.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Province>> GetProvinces(int countryid)
        {
           
            string wc = " where countryid = " + countryid + " ";

            string sort = " order by Name ASC";
            var dp = new DynamicParameters();
            try
            {
                    var getAll = await _repositoryProvinceDapper.QueryAsync<Province>("Select appprovinces.* from appprovinces " + wc + sort, dp);
                    return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
