using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using ezinvmvc.App.Accounting.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Accounting
{
    public class AccountClassManager : DomainService, IAccountClassManager 
    {
        private readonly IRepository<AccountClass> _repository;

        public AccountClassManager(IRepository<AccountClass> repository)
        {
            _repository = repository;
        }

        public async Task<IdentityResult> CreateAsync(AccountClass entity)
        {
            var result = _repository.FirstOrDefault(x => x.Name == entity.Name);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repository.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repository.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repository.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<AccountClass>> GetAllList()
        {
             return await _repository.GetAllListAsync();
        }

        public async Task<AccountClass> GetByIdAsync(int id)
        {
            var result = _repository.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repository.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(AccountClass entity)
        {
            try
            {
                await _repository.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
