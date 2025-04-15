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

namespace ezinvmvc.App.Purchases
{
    public class OrderItemManager : DomainService, IOrderItemManager
    {
        private readonly IRepository<OrderItem> _repository;
        private readonly IDapperRepository<OrderItem> _repositoryDapper;

        public OrderItemManager(IRepository<OrderItem> repository, IDapperRepository<OrderItem> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(OrderItem entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
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

        public Task<IdentityResult> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<OrderItem>> GetByIdAsync(int id)
        {
            string wc = " Where OrderId = @OrderId ";
            string sort = " Order By Id ";

            var dp = new DynamicParameters();
            dp.Add("@OrderId", id);
            try
            {
                    var output = await _repositoryDapper.QueryAsync<OrderItem>("select count(*) Over() TotalRows,poi.* from apppurchaseorderitems poi " + wc + sort, dp);
                    return output;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(OrderItem entity)
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
