using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public class DocumentManager : DomainService, IDocumentManager
    {
        private readonly IRepository<Documents> _repository;
        private readonly IDapperRepository<Documents> _repositoryDapper;

        public DocumentManager(IRepository<Documents> repository, IDapperRepository<Documents> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Documents entity)
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

        public async Task<IEnumerable<Documents>> GetAllList()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<IEnumerable<Documents>> GetAllListFiltered(int id, string reference, int referenceId, string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string wc = " Where v.isdeleted = 0 ";
            string join = "";
            var dp = new DynamicParameters();
            if (id > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (v.Id = @id) ";
                }
                else
                {
                    wc = wc + " And (v.Id = @id) ";
                }
                dp.Add("@id", id);
            }
            if (reference != null || string.IsNullOrEmpty(reference.Trim()))
            {
                if (reference.ToUpper() == "Quotation".ToUpper())
                {
                    join = join + " inner join appquotations as r on v.referenceid=r.id ";
                }
            }
            if (referenceId > 0)
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " Where (r.Id = @refid) ";
                }
                else
                {
                    wc = wc + " And (r.Id = @refid) ";
                }
                dp.Add("@refid", referenceId);
            }
            if (filter != null && filter.Trim() != "")
            {
                wc = wc + " And ((v.Filename + ' ' + v.FileExtension) like @Filter) ";
                dp.Add("@Filter", "%" + filter + "%");
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
                sort = " order by v.id asc ";
            }
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Documents>("select count(*) Over() TotalRows, v.*, v.FilePath + '\\' + v.FileName AS FullName, r.Code as ReferenceCode, u.Username as ReferenceName FROM appdocuments as v inner join abpusers as u on v.creatoruserid=u.id " + join + " " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Documents> GetByIdAsync(int id)
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

        public async Task<IdentityResult> UpdateAsync(Documents entity)
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
