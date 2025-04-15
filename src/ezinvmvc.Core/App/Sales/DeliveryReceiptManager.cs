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


namespace ezinvmvc.App.Sales
{
   public class DeliveryReceiptManager : DomainService, IDeliveryReceiptManager
    {
        private readonly IRepository<DeliveryReceipt> _repository;
        private readonly IDapperRepository<DeliveryReceipt> _repositoryDapper;
        public DeliveryReceiptManager(IRepository<DeliveryReceipt> repository, IDapperRepository<DeliveryReceipt> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(DeliveryReceipt entity)
        {
            await _repository.InsertAndGetIdAsync(entity);
            return IdentityResult.Success;
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

        public async Task<IEnumerable<DeliveryReceipt>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            //0
            string idfilter = "";
            //1
            string clientfilter = "";
            //2
            string statusfilter = "";
            //3
            string startdatefilter = "";
            //4
            string enddatefilter = "";
            //5
            string clientidfilter = "";

            //6 MARC 09/01/2021
            string stockentryfilter = "";
            //END MARC 09/01/2021

            //6 MARC 09/01/2021
            string SOnumberfilter = "";
            string DRnumberfilter = "";
            //END MARC 09/01/2021

            //MARC SO Revision 06042024
            string soidfilter = "";
            //MARC SO Revision 06042024

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
            //MARC 09 / 01 / 2021
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    stockentryfilter = tokens[6].ToString();
                }
            }
            //END MARC 09/01/2021

            //Wilson 12 / 05 / 2023
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    SOnumberfilter = tokens[7].ToString();
                }
            }
            if (tokens.Length > 8)
            {
                if (tokens[8].ToString() != "null")
                {
                    DRnumberfilter = tokens[8].ToString();
                }
            }
            //END MARC 09/01/2021

            //MARC SO Revision 06042024
            if(tokens.Length > 9)
            {
                if(tokens[9].ToString() != "null")
                {
                    soidfilter = tokens[9].ToString();
                }
            }
            //MARC SO Revision 06042024

            string wc = " Where dr.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (idfilter != "")
            {
                wc = wc + " And dr.code like @Id ";
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
                wc = wc + " And dr.statusid  in (" + statusfilter + ") ";
            }

            if (startdatefilter != "" && enddatefilter != "")
            {
                wc = wc + " And dr.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(startdatefilter).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(enddatefilter).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (clientidfilter != "")
            {
                wc = wc + " And dr.ClientId = @ClientId ";
                dp.Add("@ClientId", clientidfilter);
            }            

            //MARC 09 / 01 / 2021
            if (stockentryfilter != "")
            {
                wc = wc + " And (dr.code + ' - ' + c.name) like @stockentryfilter ";
                dp.Add("@stockentryfilter", "%" + stockentryfilter + "%");
            }
            //END MARC 09/01/2021

            //wilson 12 / 05 / 2023
            if (SOnumberfilter != "")
            {
                wc = wc + " And so.Code like @SOnumberfilter ";
                dp.Add("@SOnumberfilter", "%" + SOnumberfilter + "%");
            }
            if (DRnumberfilter != "")
            {
                wc = wc + " And dr.DrNumber like @DRnumberfilter ";
                dp.Add("@DRnumberfilter", "%" + DRnumberfilter + "%");
            }
            //End wilson 12 / 05 / 2023

            //MARC SO Revision 06042024
            if(soidfilter != "")
            {
                wc = wc + " And dr.SalesOrderId = @SOId ";
                dp.Add("@SOId", soidfilter);
            }
            //MARC SO Revision 06042024

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
                sort = " order by dr.Id asc";
            }

            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<DeliveryReceipt>(" select count(*) Over() TotalRows,dr.*,c.Name Client,ss.Status, 	CONVERT(VARCHAR(10), dr.TransactionTime, 101) TransactionTimeF, e.FirstName + ' ' + e.LastName Agent, so.Code as SalesOrderCode,so.ClientOrderNo   from AppDeliveryReceipt dr with (nolock) inner join appclients c with (nolock) on c.id = dr.clientid inner join appseriestype st with (nolock) on st.id = dr.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = dr.StatusId and ss.transactioncode = 102 inner join AppEmployee e with (nolock) on e.Id = dr.SalesAgentId  inner join AppSalesOrders as so with (nolock) on dr.SalesOrderId = so.id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<DeliveryReceipt>(" select count(*) Over() TotalRows,dr.*,c.Name Client,ss.Status, 	CONVERT(VARCHAR(10), dr.TransactionTime, 101) TransactionTimeF, e.FirstName + ' ' + e.LastName Agent, so.Code as SalesOrderCode,so.ClientOrderNo   from AppDeliveryReceipt dr with (nolock) inner join appclients c with (nolock) on c.id = dr.clientid inner join appseriestype st with (nolock) on st.id = dr.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = dr.StatusId and ss.transactioncode = 102 inner join AppEmployee e with (nolock) on e.Id = dr.SalesAgentId  inner join AppSalesOrders as so with (nolock) on dr.SalesOrderId = so.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
        public async Task<DeliveryReceipt> GetByIdAsync(int id)
        {
            string wc = " Where dr.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                //var getAll = await _repositoryDapper.QueryAsync<DeliveryReceipt>("select count(*) Over() TotalRows,dr.*,c.Name Client,ss.Status, 	CONVERT(VARCHAR(10), TransactionTime, 101) TransactionTimeF, e.FirstName + ' ' + e.LastName Agent  from AppDeliveryReceipt dr inner join appclients c on c.id = dr.clientid inner join appseriestype st on st.id = dr.SeriesTypeId inner join appstatustypes ss on ss.code = dr.StatusId and ss.transactioncode = 102 inner join AppEmployee e on e.Id = dr.SalesAgentId  " + wc, dp);
                var getAll = await _repositoryDapper.QueryAsync<DeliveryReceipt>(" select count(*) Over() TotalRows,dr.*,c.Name Client,ss.Status, 	CONVERT(VARCHAR(10), dr.TransactionTime, 101) TransactionTimeF, e.FirstName + ' ' + e.LastName Agent, so.Code as SalesOrderCode from AppDeliveryReceipt dr with (nolock) inner join appclients c with (nolock) on c.id = dr.clientid inner join appseriestype st with (nolock) on st.id = dr.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = dr.StatusId and ss.transactioncode = 102 inner join AppEmployee e with (nolock) on e.Id = dr.SalesAgentId  inner join AppSalesOrders as so with (nolock) on dr.SalesOrderId = so.id " + wc, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(DeliveryReceipt entity)
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
