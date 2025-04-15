using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.AspNetCore.Identity;
using System;

namespace ezinvmvc.App.Products
{
    public class CategoryManager : DomainService, ICategoryManager
    {
        private readonly IRepository<Category> _repositoryCategory;
        public CategoryManager(IRepository<Category> repositoryCategory)
        {
            _repositoryCategory = repositoryCategory;
        }

        public async Task<IdentityResult> CreateAsync(Category entity)
        {
            var result = _repositoryCategory.FirstOrDefault(x => x.Name == entity.Name);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryCategory.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryCategory.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryCategory.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Category>> GetAllList()
        {
            return await _repositoryCategory.GetAllListAsync();
        }

        public async Task<Category> GetByIdAsync(int id)
        {
            var result = _repositoryCategory.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryCategory.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(Category entity)
        {
            try
            {
                await _repositoryCategory.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
