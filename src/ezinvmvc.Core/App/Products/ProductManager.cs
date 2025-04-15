﻿using System.Collections.Generic;
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
    public class ProductManager : DomainService, IProductManager
    {
        private readonly IRepository<Product> _repositoryProduct;
        private readonly IDapperRepository<Product> _repositoryProductDapper;

        public ProductManager(IRepository<Product> repositoryProduct, IDapperRepository<Product> repositoryProductDapper)
        {
            _repositoryProduct = repositoryProduct;
            _repositoryProductDapper = repositoryProductDapper;
        }

        public async Task<IdentityResult> CreateAsync(Product entity)
        {
            var result = _repositoryProduct.FirstOrDefault(x => x.Code == entity.Code);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryProduct.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryProduct.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryProduct.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }

        }

        public async Task<IEnumerable<Product>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string categoryfilter = "";
            string brandfilter = "";
            string namefilter = "";

            if (tokens[0].ToString() != "null")
            {
                categoryfilter = tokens[0].ToString();
            }

            if (tokens[1].ToString() != "null")
            {
                brandfilter = tokens[1].ToString();
            }

            if (tokens[2].ToString() != "null")
            {
                namefilter = tokens[2].ToString();
            }

            string wc = " Where isdeleted = 0 ";

            if (categoryfilter != "")
            {
                wc = wc + " And p.categoryid in ("+ categoryfilter + ") ";
            }
            if (brandfilter != "")
            {
                wc = wc + " And p.brandid in ("+brandfilter+") ";
            }
            if (namefilter != null && namefilter.Trim() != "")
            {
                wc = wc + " And (p.name like @Filter) or (p.code = @Filter2) ";
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
            else
            {
                sort = " order by name asc ";
            }
            var dp = new DynamicParameters();
            dp.Add("@Filter", "%" + namefilter + "%");
            dp.Add("@Filter2", namefilter);
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryProductDapper.QueryAsync<Product>(" select count(*) Over() TotalRows,p.*,b.name Brand,c.name Category,0 Stocks, u.name Unit,0 Price from appproducts p with (nolock) inner join appcategories c with (nolock) on c.id = p.categoryid inner join appbrands b with (nolock) on b.id = p.brandid inner join appunits u with (nolock) on u.id = p.unitid " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryProductDapper.QueryAsync<Product>(" select count(*) Over() TotalRows,p.*,b.name Brand,c.name Category,0 Stocks, u.name Unit,0 Price from appproducts p with (nolock) inner join appcategories c with (nolock) on c.id = p.categoryid inner join appbrands b with (nolock) on b.id = p.brandid inner join appunits u with (nolock) on u.id = p.unitid " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Product> GetByIdAsync(int id)
        {
            var result = _repositoryProduct.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryProduct.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Product>> GetByName(string name)
        {
            string wc = " Where isdeleted = 0 ";

            if (name != "")
            {
                wc = wc + " And (p.name like @name or p.code like @name) ";
            }

            string sort = "";
            sort = " order by name asc ";
            var dp = new DynamicParameters();
            dp.Add("@name", "%" + name + "%");
            try
            {
                var getAll = await _repositoryProductDapper.QueryAsync<Product>(" select top 60 p.* from appproducts p with (nolock) " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Product entity)
        {
            try
            {

                await _repositoryProduct.UpdateAsync(entity);
                return IdentityResult.Success;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
