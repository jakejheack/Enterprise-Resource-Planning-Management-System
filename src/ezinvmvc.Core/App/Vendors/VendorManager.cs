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

namespace ezinvmvc.App.Vendors
{
    public class VendorManager : DomainService, IVendorManager
    {
        private readonly IRepository<Vendor> _repository;
        private readonly IDapperRepository<Vendor> _repositoryDapper;

        public VendorManager(IRepository<Vendor> repository, IDapperRepository<Vendor> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Vendor entity)
        {
            var result = _repository.FirstOrDefault(x => x.Name == entity.Name);
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

        public async Task<IEnumerable<Vendor>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string namefilter = "";
            string istransporterfilter = "";
            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    namefilter = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    istransporterfilter = tokens[1];
                }
            }


            string wc = " Where isdeleted = 0 ";
            if (namefilter != null && namefilter.Trim() != "")
            {
                wc = wc + " And (v.name like @Filter) ";
            }
            if (istransporterfilter != null && istransporterfilter.Trim() != "")
            {
                wc = wc + " And (v.IsTransporter = @IsTransporter) ";
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
            dp.Add("@IsTransporter", istransporterfilter);
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<Vendor>("select count(*) Over() TotalRows,v.* from appvendors v " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Vendor>("select count(*) Over() TotalRows,v.* from appvendors v " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Vendor> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(Vendor entity)
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
