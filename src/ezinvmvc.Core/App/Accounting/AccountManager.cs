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

namespace ezinvmvc.App.Accounting
{
    public class AccountManager : DomainService, IAccountManager
    {
        private readonly IRepository<Account> _repository;
        private readonly IDapperRepository<Account> _repositoryDapper;

        public AccountManager(IRepository<Account> repository, IDapperRepository<Account> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Account entity)
        {
            var result = _repository.FirstOrDefault(x => x.Code == entity.Code);
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

        public async Task<IEnumerable<Account>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string isactive = "";
            string company = "";
            string classname = "";
            string namefilter = "";
            string isparent = "";

            if (tokens[0].ToString() != "null")
            {
                company = tokens[0].ToString();
            }
            if (tokens[1].ToString() != "null")
            {
                isactive = tokens[1].ToString();
            }
            if (tokens[2].ToString() != "null")
            {
                classname = tokens[2].ToString();
            }
            if (tokens[3].ToString() != "null")
            {
                namefilter = tokens[3].ToString();
            }
            if (tokens[4].ToString() != "null")
            {
                isparent = tokens[4].ToString();
            }
            string wc = " Where isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (company != "")
            {
                wc = wc + " And a.companyid = @CompanyId ";
            }
            if (isactive != "")
            {
                wc = wc + " And a.isactive = @IsActive ";
                dp.Add("@IsActive", isactive);
            }
            if (classname != "")
            {
                wc = wc + " And a.accountclassid in (" + classname + ") ";
            }
            if (namefilter != null && namefilter.Trim() != "")
            {
                wc = wc + " And ((a.name like @Filter) or (a.code like @Filter2)) ";
                dp.Add("@Filter", "%" + namefilter + "%");
                dp.Add("@Filter2", "%" + namefilter + "%");
            }
            if (isparent != "")
            {
                //is child as is parent
                wc = wc + " And a.ischild = @IsParent ";
                dp.Add("@IsParent", isparent);
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
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<Account>("select  count(*) Over() TotalRows,a.*, a.Id as tt_key, a.ParentNode as tt_parent, ac.name AccountClass, ac.Base AccountBase,at.Name AccountType, ag.Name AccountGroup, c.Name Company, c.Abbr CompanyAbbr from appaccount a inner join appaccountclass ac on ac.id = a.accountclassid inner join appaccounttype at on at.id = a.accounttypeid inner join appaccountgroup ag on ag.id = a.accountgroupid inner join appcompany c on c.id = a.companyid " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Account>("select  count(*) Over() TotalRows,a.*, a.Id as tt_key, a.ParentNode as tt_parent, ac.name AccountClass, ac.Base AccountBase,at.Name AccountType, ag.Name AccountGroup, c.Name Company, c.Abbr CompanyAbbr from appaccount a inner join appaccountclass ac on ac.id = a.accountclassid inner join appaccounttype at on at.id = a.accounttypeid inner join appaccountgroup ag on ag.id = a.accountgroupid inner join appcompany c on c.id = a.companyid " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Account> GetByIdAsync(int id)
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

        public async Task<IEnumerable<Account>> GetByName(string name)
        {
            string wc = " Where isdeleted = 0 and isactive = 1 ";

            if (name != "")
            {
                wc = wc + " And (a.name like @name or a.code like @name) ";
            }

            string sort = "";
            sort = " order by name asc ";
            var dp = new DynamicParameters();
            dp.Add("@name", "%" + name + "%");
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Account>("select a.*, a.Id as tt_key, a.ParentNode as tt_parent from appaccount a " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Account>> GetByNode(string node)
        {
            string wc = " Where isdeleted = 0 and isactive = 1 ";

            if (node != "")
            {
                wc = wc + " And (a.node = @node) ";
            }

            string sort = "";
            sort = " order by name asc ";
            var dp = new DynamicParameters();
            dp.Add("@node", node);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Account>("select a.*, a.Id as tt_key, a.ParentNode as tt_parent from appaccount a " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Account>> GetByParentNode(string parentnode)
        {
            string wc = " Where isdeleted = 0 and isactive = 1 ";

            if (parentnode != "")
            {
                wc = wc + " And (a.parentnode = @parentnode) ";
            }

            string sort = "";
            sort = " order by name asc ";
            var dp = new DynamicParameters();
            dp.Add("@parentnode", parentnode);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Account>("select a.*, a.Id as tt_key, a.ParentNode as tt_parent from appaccount a " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Account entity)
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
