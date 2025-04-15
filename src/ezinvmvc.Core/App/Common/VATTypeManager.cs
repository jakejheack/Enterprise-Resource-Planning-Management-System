using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public class VATTypeManager : DomainService, IVATTypeManager
    {
        private readonly IRepository<VATType> _repositoryVATType;

        public VATTypeManager(IRepository<VATType> repositoryVATType)
        {
            _repositoryVATType = repositoryVATType;
        }

        public async Task<IdentityResult> CreateAsync(VATType entity)
        {
            var result = _repositoryVATType.FirstOrDefault(x => x.Name == entity.Name);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryVATType.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryVATType.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryVATType.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<VATType>> GetAllList()
        {
            return await _repositoryVATType.GetAllListAsync();
        }

        public async Task<VATType> GetByIdAsync(int id)
        {
            var result = _repositoryVATType.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryVATType.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(VATType entity)
        {
            try
            {
                await _repositoryVATType.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
