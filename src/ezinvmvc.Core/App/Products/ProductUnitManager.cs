using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.AspNetCore.Identity;
using Dapper;
using Abp.Dapper.Repositories;
using System;
using System.Linq;

namespace ezinvmvc.App.Products
{
    public class ProductUnitManager : DomainService, IProductUnitManager
    {
        private readonly IRepository<ProductUnit> _repository;
        private readonly IDapperRepository<ProductUnit> _repositoryDapper;

        public ProductUnitManager(IRepository<ProductUnit> repository, IDapperRepository<ProductUnit> repositorydapper)
        {
            _repository = repository;
            _repositoryDapper = repositorydapper;
        }

        public async Task<IdentityResult> CreateAsync(ProductUnit entity)
        {
            var result = _repository.FirstOrDefault(x => x.ProductId == entity.ProductId && x.UnitId == entity.UnitId);
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

        public async Task<IdentityResult> UpdateAsync(ProductUnit entity)
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
        public async Task<IEnumerable<ProductUnit>> GetAllList(int productid)
        {
            string wc = "";
            if (productid > 0)
            {
                wc = wc + " Where pu.ProductId = @ProductId ";
            }
            string sort = " order by conversion asc ";
            var dp = new DynamicParameters();
            dp.Add("@ProductId", productid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<ProductUnit>(" select pu.*,u.name Unit from AppProductUnits pu with (nolock) inner join AppUnits u with (nolock) on u.id = pu.UnitId " + wc + sort , dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<ProductUnit> GetByIdAsync(int id)
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
    }
}
