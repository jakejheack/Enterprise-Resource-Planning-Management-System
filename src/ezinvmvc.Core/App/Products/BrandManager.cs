using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Products
{
    public class BrandManager : DomainService, IBrandManager
    {
        private readonly IRepository<Brand> _repositoryBrand;
        public BrandManager(IRepository<Brand> repositoryBrand)
        {
            _repositoryBrand = repositoryBrand;
        }

        public async Task<IdentityResult> CreateAsync(Brand entity)
        {
            var result = _repositoryBrand.FirstOrDefault(x => x.Name == entity.Name);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryBrand.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryBrand.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryBrand.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Brand>> GetAllList()
        {
            return await _repositoryBrand.GetAllListAsync();
        }
        public async Task<Brand> GetByIdAsync(int id)
        {
            var result = _repositoryBrand.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryBrand.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(Brand entity)
        {
            try
            {
                await _repositoryBrand.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
