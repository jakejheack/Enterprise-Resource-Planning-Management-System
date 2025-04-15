using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Common
{
    public class OrderTypeManager : DomainService, IOrderTypeManager
    {
        private readonly IRepository<OrderType> _repository;
        private readonly IDapperRepository<OrderType> _repositoryDapper;

        public OrderTypeManager(IRepository<OrderType> repository, IDapperRepository<OrderType> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
        public async Task<IdentityResult> CreateAsync(OrderType entity)
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

        public async Task<IEnumerable<OrderType>> GetAllList()
        {
            try
            {
                //return await _repository.GetAllListAsync();
                var getAll = await _repositoryDapper.QueryAsync<OrderType>("select a.*, b.Name Currency from appOrderTypes a left outer join AppCurrency b on b.Id = a.CurrencyId ");
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<OrderType> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(OrderType entity)
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
