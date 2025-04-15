using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using ezinvmvc.App.Addresses.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public class CityManager : DomainService, ICityManager
    {
        private readonly IRepository<City> _repositoryCity;
        public CityManager(IRepository<City> repositoryCity)
        {
            _repositoryCity = repositoryCity;
        }

        public async Task<IdentityResult> CreateAsync(City entity)
        {
            var result = _repositoryCity.FirstOrDefault(x => x.Name == entity.Name);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryCity.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryCity.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryCity.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<City>> GetAllList()
        {
            return await _repositoryCity.GetAllListAsync();
        }

        public async Task<City> GetByIdAsync(int id)
        {
            var result = _repositoryCity.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryCity.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(City entity)
        {
            try
            {
                await _repositoryCity.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
