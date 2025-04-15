using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Addresses.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Addresses
{
    public class AddressManager : DomainService, IAddressManager
    {
        private readonly IRepository<Address> _repositoryAddress;
        private readonly IDapperRepository<Address> _repositoryDapper;

        public AddressManager(IRepository<Address> repositoryAddress, IDapperRepository<Address> repositoryDapper)
        {
            _repositoryAddress = repositoryAddress;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Address entity)
        {
            //var result = _repositoryAddress.FirstOrDefault(x => x.Name == entity.Name);
            //if (result != null)
            //{
            //    throw new UserFriendlyException("Already exist!");
            //}
            //else
            //{
                await _repositoryAddress.InsertAndGetIdAsync(entity);
                return IdentityResult.Success;
            //}
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryAddress.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryAddress.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Address>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] token = filter.Split('|');
            string refid = "", reference = "";
            if(token.Length > 0)
            {
                if(token[0] != "null")
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
            string wc = " Where isdeleted = 0 ";
            var dp = new DynamicParameters();
            if (refid.Trim().Length > 0)
            {
                wc = wc + " AND ReferenceId = @refid";
                dp.Add("@refid", refid);
            }
            if (reference.Trim().Length > 0)
            {
                wc = wc + " AND Reference = @reference";
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
                sort = " order by id desc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Client>("select count(*) Over() TotalRows,v.* from appclients v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    var getAll = await _repositoryDapper.QueryAsync<Address>("SELECT count(*) Over() AS TotalRows,a.*, a.AddressDescription + ', ' + cty.Name + ', ' + prv.Name + ', ' + ctr.Name AS CompleteAddress, ctr.name as Country, prv.Name as Province, cty.Name as City from appAddress as a INNER JOIN appcountries as ctr on a.countryid=ctr.id inner join appprovinces as prv on a.provinceid=prv.id inner join appcities as cty on a.cityid=cty.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Address>("SELECT count(*) Over() AS TotalRows,a.*, a.AddressDescription + ', ' + cty.Name + ', ' + prv.Name + ', ' + ctr.Name AS CompleteAddress, ctr.name as Country, prv.Name as Province, cty.Name as City from appAddress as a INNER JOIN appcountries as ctr on a.countryid=ctr.id inner join appprovinces as prv on a.provinceid=prv.id inner join appcities as cty on a.cityid=cty.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Address> GetByIdAsync(int id)
        {
            var result = _repositoryAddress.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryAddress.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<Address> GetByReferenceIdAsync(int refid, string reference)
        {
            //var result = _repositoryAddress.FirstOrDefault(x => x.Id == id);
            //if (result != null)
            //{
            //    return await _repositoryAddress.GetAsync(id);
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
                var getAll = await _repositoryDapper.QueryAsync<Address>("SELECT a.*, a.AddressDescription + ', ' + cty.Name + ', ' + prv.Name + ', ' + ctr.Name AS CompleteAddress, ctr.name as Country, prv.Name as Province, cty.Name as City from appAddress as a INNER JOIN appcountries as ctr on a.countryid=ctr.id inner join appprovinces as prv on a.provinceid=prv.id inner join appcities as cty on a.cityid=cty.id " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Address entity)
        {
            try
            {
                await _repositoryAddress.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }
    }
}
