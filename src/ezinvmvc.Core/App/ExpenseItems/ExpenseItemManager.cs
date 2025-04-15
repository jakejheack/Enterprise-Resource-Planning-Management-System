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

namespace ezinvmvc.App.ExpenseItems
{
    public class ExpenseItemManager : DomainService, IExpenseItemManager
    {
        private readonly IRepository<ExpenseItem> _repositoryExpenseItem;
        private readonly IDapperRepository<ExpenseItem> _repositoryExpenseItemDapper;

        public ExpenseItemManager(IRepository<ExpenseItem> repositoryExpenseItem, IDapperRepository<ExpenseItem> repositoryExpenseItemDapper)
        {
            _repositoryExpenseItem = repositoryExpenseItem;
            _repositoryExpenseItemDapper = repositoryExpenseItemDapper;
        }

        public async Task<IdentityResult> CreateAsync(ExpenseItem entity)
        {
            var result = _repositoryExpenseItem.FirstOrDefault(x => x.Code == entity.Code);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryExpenseItem.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryExpenseItem.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryExpenseItem.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }

        }

        public async Task<IEnumerable<ExpenseItem>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
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

            string wc = " Where p.isdeleted = 0 ";
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
                    var getAll = await _repositoryExpenseItemDapper.QueryAsync<ExpenseItem>(" select count(*) Over() TotalRows,p.*, isnull(act.name, '') expenseaccount from appexpenseitems p with (nolock) left outer join appaccount act on p.expenseaccountid=act.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryExpenseItemDapper.QueryAsync<ExpenseItem>("Select count(*) OVER() AS TotalRows,p.*, isnull(act.name, '') expenseaccount from appexpenseitems p with (nolock) left outer join appaccount act on p.expenseaccountid=act.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<ExpenseItem> GetByIdAsync(int id)
        {
            var result = _repositoryExpenseItem.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryExpenseItem.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<ExpenseItem>> GetByName(string name)
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
                var getAll = await _repositoryExpenseItemDapper.QueryAsync<ExpenseItem>(" select top 60 p.* from appexpenseitems p with (nolock) " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(ExpenseItem entity)
        {
            try
            {

                await _repositoryExpenseItem.UpdateAsync(entity);
                return IdentityResult.Success;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
