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
    public class ProductPriceManager : DomainService, IProductPriceManager
    {
        private readonly IRepository<ProductPrice> _repository;
        private readonly IDapperRepository<ProductPrice> _repositoryDapper;

        public ProductPriceManager(IRepository<ProductPrice> repository, IDapperRepository<ProductPrice> repositorydapper)
        {
            _repository = repository;
            _repositoryDapper = repositorydapper;
        }
        public async Task<IdentityResult> CreateAsync(ProductPrice entity)
        {
            var result = _repository.FirstOrDefault(x => x.ProductId == entity.ProductId && x.UnitId == entity.UnitId && x.PricingTypeId == entity.PricingTypeId);
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

        public async Task<IEnumerable<ProductPrice>> GetAllList(int productid,int pricingtypeid,int unitid)
        {
            string wc = "";
            if (productid > 0)
            {
                wc = wc + " Where pp.ProductId = @ProductId ";
            }
            if (pricingtypeid > 0)
            {
                if (wc == "")
                {
                    wc = wc + " Where pp.PricingTypeId = @PricingTypeId ";
                }
                else
                {
                    wc = wc + " And pp.PricingTypeId = @PricingTypeId ";
                }
            }
            if (unitid > 0)
            {
                if (wc == "")
                {
                    wc = wc + " Where pp.UnitId = @UnitId ";
                }
                else
                {
                    wc = wc + " And pp.UnitId = @UnitId ";
                }
            }

            if (wc == "")
            {
                wc = wc + " Where pp.IsDeleted = 0 ";
            }
            else
            {
                wc = wc + " And pp.IsDeleted = 0 ";
            }
            string sort = " order by PricingType,Unit asc ";
            var dp = new DynamicParameters();
            dp.Add("@ProductId", productid);
            dp.Add("@PricingTypeId", pricingtypeid);
            dp.Add("@UnitId", unitid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<ProductPrice>(" select pp.*,u.Name Unit,pt.Name PricingType from AppProductPrice pp with (nolock) inner join AppUnits u with (nolock) on u.id = pp.UnitId inner join AppPricingType pt with (nolock) on pt.id = pp.pricingtypeid " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<ProductPrice> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(ProductPrice entity)
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
