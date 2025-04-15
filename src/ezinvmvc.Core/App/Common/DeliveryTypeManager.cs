using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Common
{
   public class DeliveryTypeManager : DomainService, IDeliveryTypeManager
    {
        private readonly IRepository<DeliveryType> _repository;

        public DeliveryTypeManager(IRepository<DeliveryType> repository)
        {
            _repository = repository;
        }

        public async Task<IdentityResult> CreateAsync(DeliveryType entity)
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

        public async Task<IEnumerable<DeliveryType>> GetAllList()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<DeliveryType> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(DeliveryType entity)
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
