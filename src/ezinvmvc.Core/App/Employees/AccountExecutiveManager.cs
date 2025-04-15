using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Employees.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Employees
{
    public class AccountExecutiveManager : DomainService, IAccountExecutiveManager
    {
        private readonly IRepository<AccountExecutive> _repositoryAccountExecutive;
        private readonly IDapperRepository<AccountExecutive> _repositoryDapper;

        public AccountExecutiveManager(IRepository<AccountExecutive> repositoryAccountExecutive, IDapperRepository<AccountExecutive> repositoryDapper)
        {
            _repositoryAccountExecutive = repositoryAccountExecutive;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(AccountExecutive entity)
        {
            //var result = _repositoryAccountExecutive.FirstOrDefault(x => x.Name == entity.Name);
            //if (result != null)
            //{
            //    throw new UserFriendlyException("Already exist!");
            //}
            //else
            //{
                await _repositoryAccountExecutive.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            //}
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryAccountExecutive.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryAccountExecutive.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }



        public async Task<IEnumerable<AccountExecutive>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] token = filter.Split('|');
            string refid = "", reference = "";
            if (token.Length > 0)
            {
                if (token[0] != "null")
                {
                    refid = token[0];
                }
            }
            if (token.Length > 1)
            {
                if (token[1] != "null")
                {
                    reference = token[1];
                }
            }
            string wc = " Where a.isdeleted = 0 ";
            var dp = new DynamicParameters();
            if (refid.Trim().Length > 0)
            {
                wc = wc + " AND a.ReferenceId = @refid";
                dp.Add("@refid", refid);
            }
            if (reference.Trim().Length > 0)
            {
                wc = wc + " AND a.Reference = @reference";
                dp.Add("@reference", reference);
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
                sort = " order by a.id desc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Client>("select count(*) Over() TotalRows,v.* from appclients v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    var getAll = await _repositoryDapper.QueryAsync<AccountExecutive>("SELECT count(*) Over() AS TotalRows,a.*, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName AS EmployeeName from appAccountExecutives as a  left outer join appemployee as e on a.employeeid=e.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<AccountExecutive>("SELECT count(*) Over() AS TotalRows,a.*, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName AS EmployeeName from appAccountExecutives as a  left outer join appemployee as e on a.employeeid=e.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<AccountExecutive> GetByIdAsync(int id)
        {
            var result = _repositoryAccountExecutive.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryAccountExecutive.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<AccountExecutive> GetByReferenceIdAsync(int refid, string reference)
        {
            //var result = _repositoryAccountExecutive.FirstOrDefault(x => x.Id == id);
            //if (result != null)
            //{
            //    return await _repositoryAccountExecutive.GetAsync(id);
            //}
            //else
            //{
            //    throw new UserFriendlyException("No Data Found!");
            //}
            string wc = " Where a.ReferenceId = @refId AND a.Reference = @ref AND a.IsActive = 1 ";

            var dp = new DynamicParameters();
            dp.Add("@refId", refid);
            dp.Add("@ref", reference);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<AccountExecutive>("SELECT a.*, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName AS EmployeeName from appAccountExecutives as a  left outer join appemployee as e on a.employeeid=e.id " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(AccountExecutive entity)
        {
            try
            {
                await _repositoryAccountExecutive.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
