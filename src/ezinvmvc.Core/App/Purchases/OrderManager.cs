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
   public class OrderManager : DomainService, IOrderManager
    {
        private readonly IRepository<Order> _repository;
        private readonly IDapperRepository<Order> _repositoryDapper;

        public OrderManager(IRepository<Order> repository, IDapperRepository<Order> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Order entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
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

        public async Task<IEnumerable<Order>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string idfilter = "";
            string vendorfilter = "";
            string statusfilter = "";
            string startdatefilter = "";
            string enddatefilter = "";

            if (tokens[0].ToString() != "null")
            {
                idfilter = tokens[0].ToString();
            }
            if (tokens[1].ToString() != "null")
            {
                vendorfilter = tokens[1].ToString();
            }
            if (tokens[2].ToString() != "null")
            {
                statusfilter = tokens[2].ToString();
            }
            if (tokens[3].ToString() != "null" && tokens[4].ToString() != "null")
            {
                startdatefilter = tokens[3].ToString();
                enddatefilter = tokens[4].ToString();
            }

            string wc = " Where po.isdeleted = false ";
            if (idfilter != "")
            {
                wc = wc + " And po.id = @Id ";
            }
            if (vendorfilter != "")
            {
                wc = wc + " And v.name like @Vendor ";
            }
            if (statusfilter != "")
            {
                wc = wc + " And po.status  in (" + statusfilter + ") ";
            }

            if (startdatefilter != "" && enddatefilter != "")
            {
                wc = wc + " And po.transactiontime  between @StartDate and @EndDate ";
            }

            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " " + lastWord;
            }

            if (statusfilter != "")
            {
                statusfilter ="'" + statusfilter.Replace(",", "','") + "'";
            }
            var dp = new DynamicParameters();
            dp.Add("@Id", idfilter);
            dp.Add("@Vendor", "%" + vendorfilter + "%");
            dp.Add("@StartDate", startdatefilter);
            dp.Add("@EndDate", enddatefilter);
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<Order>("select count(*) Over() TotalRows,po.*,v.Name Vendor from apppurchaseorder po inner join appvendors v on v.Id = po.vendorid  " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Order>("select count(*) Over() TotalRows,po.*,v.Name Vendor from apppurchaseorder po inner join appvendors v on v.Id = po.vendorid  " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Order> GetByIdAsync(int id)
        {

            string wc = " Where po.Id = @Id ";
       
            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Order>("select po.* from apppurchaseorder po " + wc , dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Order entity)
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
