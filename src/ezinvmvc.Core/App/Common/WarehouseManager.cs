using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.AspNetCore.Identity;
using Abp.Dapper.Repositories;
using Dapper;

namespace ezinvmvc.App.Common
{
    public class WarehouseManager : DomainService, IWarehouseManager
    {
        private readonly IRepository<Warehouse> _repository;
        private readonly IDapperRepository<Warehouse> _repositoryDapper;

        public WarehouseManager(IRepository<Warehouse> repository, IDapperRepository<Warehouse> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }
    
        public async Task<IdentityResult> CreateAsync(Warehouse entity)
        {
            var result = _repository.FirstOrDefault(x => x.Name == entity.Name);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repository.InsertAndGetIdAsync(entity);
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

        public async Task<IEnumerable<Warehouse>> GetAllList()
        {
            return await _repository.GetAllListAsync(x => x.IsTemp == false);
        }

        public async Task<Warehouse> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(Warehouse entity)
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
