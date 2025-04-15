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

namespace ezinvmvc.App.Accounting
{
  public  class CollectionManager : DomainService, ICollectionManager
    {
        private readonly IRepository<Collection> _repository;
        private readonly IDapperRepository<Collection> _repositoryDapper;

        public CollectionManager(IRepository<Collection> repository, IDapperRepository<Collection> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Collection entity)
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

        public async Task<IEnumerable<Collection>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string idfilter = "";
            string clientfilter = "";
            string statusfilter = "";
            string startdatefilter = "";
            string enddatefilter = "";
            string clientidfilter = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    idfilter = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    clientfilter = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    statusfilter = tokens[2].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[3].ToString() != "null" && tokens[4].ToString() != "null")
                {
                    startdatefilter = tokens[3].ToString();
                    enddatefilter = tokens[4].ToString();
                }
            }
            if (tokens.Length > 5)
            {
                if (tokens[5].ToString() != "null")
                {
                    clientidfilter = tokens[5].ToString();
                }
            }

            string wc = " Where col.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (idfilter != "")
            {
                wc = wc + " And col.code like @Id ";
                dp.Add("@Id", "%" + idfilter + "%");
            }
            if (clientfilter != "")
            {
                wc = wc + " And c.name like @Client ";
                dp.Add("@Client", "%" + clientfilter + "%");
            }
            if (statusfilter != "")
            {
                statusfilter = "'" + statusfilter.Replace(",", "','") + "'";
                wc = wc + " And col.statusid  in (" + statusfilter + ") ";
            }

            if (startdatefilter != "" && enddatefilter != "")
            {
                wc = wc + " And col.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(startdatefilter).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(enddatefilter).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (clientidfilter != "")
            {
                wc = wc + " And col.ClientId = @ClientId ";
                dp.Add("@ClientId", clientidfilter);
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
                sort = " order by col.Id asc";
            }

            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<Collection>("select count(*) Over() TotalRows,col.*,c.Name Client,pm.Name PaymentMode, st.Status, isnull(colapp.allocated,0) allocated, col.GrandTotal-isnull(colapp.allocated, 0) unallocated from AppCollection col inner join AppClients c on c.Id = col.ClientId inner join AppPaymentMode pm on pm.Id = col.PaymentModeId inner join AppStatusTypes st with (nolock) on st.Code = col.StatusId  and st.TransactionCode =130 left outer join (select collectionid, sum(amount) allocated from appcollectionapplied where isdeleted=0 group by collectionid)  colapp on col.id=colapp.collectionid  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Collection>("select count(*) Over() TotalRows,col.*,c.Name Client,pm.Name PaymentMode, st.Status, isnull(colapp.allocated,0) allocated, col.GrandTotal-isnull(colapp.allocated, 0) unallocated from AppCollection col inner join AppClients c on c.Id = col.ClientId inner join AppPaymentMode pm on pm.Id = col.PaymentModeId inner join AppStatusTypes st with (nolock) on st.Code = col.StatusId  and st.TransactionCode =130 left outer join (select collectionid, sum(amount) allocated from appcollectionapplied where isdeleted=0 group by collectionid)  colapp on col.id=colapp.collectionid " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    

        public async Task<Collection> GetByIdAsync(int id)
        {
            string wc = " Where col.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Collection>("select count(*) Over() TotalRows,col.*,c.Name Client,pm.Name PaymentMode, st.Status from AppCollection col inner join AppClients c on c.Id = col.ClientId inner join AppPaymentMode pm on pm.Id = col.PaymentModeId inner join AppStatusTypes st with (nolock) on st.Code = col.StatusId  and st.TransactionCode =130 " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Collection entity)
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
