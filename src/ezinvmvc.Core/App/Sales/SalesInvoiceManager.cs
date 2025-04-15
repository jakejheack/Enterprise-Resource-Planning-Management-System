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
    public class SalesInvoiceManager : DomainService, ISalesInvoiceManager
    {
        private readonly IRepository<SalesInvoice> _repository;
        private readonly IDapperRepository<SalesInvoice> _repositoryDapper;
        public SalesInvoiceManager(IRepository<SalesInvoice> repository, IDapperRepository<SalesInvoice> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(SalesInvoice entity)
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

        public async Task<IEnumerable<SalesInvoice>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string idfilter = "";
            string clientfilter = "";
            string statusfilter = "";
            string startdatefilter = "";
            string enddatefilter = "";
            string clientidfilter = "";
            
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
            //MARC SO Revision 06042024
            if(tokens.Length > 6)
            {
                if(tokens[6].ToString() != "null")
                {
                    soidfilter = tokens[6].ToString();
                }
            }
            //MARC SO Revision 06042024

            string wc = " Where si.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (idfilter != "")
            {
                wc = wc + " And si.code = @Id ";
                dp.Add("@Id", idfilter);
            }
            if (clientfilter != "")
            {
                wc = wc + " And c.name like @Client ";
                dp.Add("@Client", "%" + clientfilter + "%");
            }
            if (statusfilter != "")
            {
                statusfilter = "'" + statusfilter.Replace(",", "','") + "'";
                wc = wc + " And si.statusid  in (" + statusfilter + ") ";
            }

            if (startdatefilter != "" && enddatefilter != "")
            {
                wc = wc + " And si.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", startdatefilter);
                dp.Add("@EndDate", enddatefilter);
            }
            if (clientidfilter != "")
            {
                wc = wc + " And si.ClientId = @ClientId ";
                dp.Add("@ClientId", clientidfilter);
            }
            //MARC SO Revision 06042024
            if(soidfilter != "")
            {
                wc = wc + " And si.SalesOrderId = @SOId ";
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
                sort = " order by Id asc";
            }
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<SalesInvoice>(" select count(*) Over() TotalRows,si.*,c.Name Client,ss.Status, 	CONVERT(VARCHAR(10), TransactionTime, 101) TransactionTimeF,e.FirstName + ' ' + e.LastName SalesAgent  from appsalesinvoice si with (nolock) inner join appclients c with (nolock) on c.id = si.clientid inner join appseriestype st with (nolock) on st.id = si.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = si.StatusId and ss.transactioncode = 103 inner join AppEmployee e with (nolock) on e.Id = si.SalesAgentId  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<SalesInvoice>(" select count(*) Over() TotalRows,si.*,c.Name Client,ss.Status, 	CONVERT(VARCHAR(10), TransactionTime, 101) TransactionTimeF,e.FirstName + ' ' + e.LastName SalesAgent  from appsalesinvoice si with (nolock) inner join appclients c with (nolock) on c.id = si.clientid inner join appseriestype st with (nolock) on st.id = si.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = si.StatusId and ss.transactioncode = 103 inner join AppEmployee e with (nolock) on e.Id = si.SalesAgentId " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
        public async Task<IEnumerable<vAccountsReceivable>> GetAR(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string idfilter = "";
            string clientfilter = "";
            string statusfilter = "";
            string startdatefilter = "";
            string enddatefilter = "";
            string clientidfilter = "";
            //COLLECTION EDIT
            string collectionfilter = "";
            string collectionnotfilter = "";

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
            //COLLECTION EDIT
            if (tokens.Length > 6)
            {
                if (tokens[5].ToString() != "null")
                {
                    collectionfilter = tokens[6].ToString();
                }
            }
            if (tokens.Length > 7)
            {
                if (tokens[5].ToString() != "null")
                {
                    collectionnotfilter = tokens[7].ToString();
                }
            }

            //MULTIPLE SI & ewt collection
            //string wc = " Where si.isdeleted = 0 and (si.GrandTotal - isnull(tmpap.Applied,0)) > 0 ";
            //string wc = " Where si.isdeleted = 0 and (si.statusid > 1 and si.statusid < 5) and (si.billGrandTotal - isnull(tmpap.Applied,0)) > 0 ";
            string wc = " Where si.isdeleted = 0 and (si.statusid > 1 and si.statusid < 5) and (si.BillGrandTotal - (isnull(tmpap.Applied,0) + isnull(tmpap.AppliedEWT,0))) > 0 ";
            string wccol = " Where co.isdeleted = 0 and co.statusid < 3 ";
            var dp = new DynamicParameters();

            if (idfilter != "")
            {
                wc = wc + " And si.code = @Id ";
                dp.Add("@Id", idfilter);
            }
            if (clientfilter != "")
            {
                wc = wc + " And c.name like @Client ";
                dp.Add("@Client", "%" + clientfilter + "%");
            }
            if (statusfilter != "")
            {
                statusfilter = "'" + statusfilter.Replace(",", "','") + "'";
                wc = wc + " And si.statusid  in (" + statusfilter + ") ";
            }

            if (startdatefilter != "" && enddatefilter != "")
            {
                wc = wc + " And si.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", startdatefilter);
                dp.Add("@EndDate", enddatefilter);
            }
            if (clientidfilter != "")
            {
                wc = wc + " And si.ClientId = @ClientId ";
                dp.Add("@ClientId", clientidfilter);
            }
            //COLLECTION EDIT
            string joincol = "", selcol = "";
            if (collectionfilter != "")
            {
                selcol = " ,isnull(collap.amount,0) as CollectionAmount,isnull(collap.ewtamount,0) as CollectionEWTAmount,isnull(collap.ewtid,0) as CollectionEWTId,isnull(collap.ewtaccountid,0) as CollectionEWTAccountId, isnull(collap.collectionId, 0) CollectionId, isnull(collap.collectionAppliedId, 0) CollectionAppliedId ";
                joincol = " left outer join (select co2.id collectionId, coap2.id CollectionAppliedId, coap2.SalesInvoiceId, coap2.amount, coap2.ewtamount, coap2.ewtid, coap2.ewtaccountid from appcollection co2 inner join AppCollectionApplied coap2 on co2.id = coap2.CollectionId where co2.id = @ColId and coap2.isdeleted = 0 ) collap on collap.salesinvoiceid = si.id ";
                //wccol = wccol + " And co.Id = @ColId ";
                dp.Add("@ColId", collectionfilter);
            }
            if (collectionnotfilter != "")
            {
                wccol = wccol + " And co.Id != @ColNotId ";
                dp.Add("@ColNotId", collectionnotfilter);
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
                sort = " order by Id asc";
            }
            try
            {
                if (!forexport)
                {
                    //MARC 11142022 status types join fix from id to code add transaction code = 103
                    //var getAll = await _repositoryDapper.QueryAsync<vAccountsReceivable>("select count(*) Over() TotalRows,si.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit,(si.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppSalesInvoice si inner join AppClients c on c.Id = si.ClientId inner join AppStatusTypes st on st.Id = si.StatusId left outer join(select co.StatusId, SalesInvoiceId, sum(Amount) Applied from AppCollection co inner join AppCollectionApplied coap on co.Id = coap.COllectionId group by co.StatusId, SalesInvoiceId) tmpap on tmpap.SalesInvoiceId = si.Id  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryDapper.QueryAsync<vAccountsReceivable>("select count(*) Over() TotalRows,si.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit,(si.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppSalesInvoice si inner join AppClients c on c.Id = si.ClientId inner join AppStatusTypes st on st.Code = si.StatusId  and st.TransactionCode =103 left outer join(select co.StatusId, SalesInvoiceId, sum(Amount) Applied from AppCollection co inner join AppCollectionApplied coap on co.Id = coap.COllectionId group by co.StatusId, SalesInvoiceId) tmpap on tmpap.SalesInvoiceId = si.Id  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //MULTIPLE SI
                    //var getAll = await _repositoryDapper.QueryAsync<vAccountsReceivable>(" select count(*) Over() TotalRows,si.*,c.Name Client, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit,(si.GrandTotal - isnull(tmpap.Applied,0)) Balance from AppSalesInvoice si with (nolock) inner join AppClients c with (nolock) on c.Id = si.ClientId inner join AppStatusTypes st with (nolock) on st.Code = si.StatusId  and st.TransactionCode =103 left outer join(select co.StatusId, SalesInvoiceId, sum(Amount) Applied from AppCollection co with (nolock) inner join AppCollectionApplied coap with (nolock) on co.Id = coap.COllectionId group by co.StatusId, SalesInvoiceId) tmpap on tmpap.SalesInvoiceId = si.Id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryDapper.QueryAsync<vAccountsReceivable>(" select count(*) Over() TotalRows,si.*,c.Name Client, st.Status " +
                        //",isnull(tmpap.Applied,0) Paid,0 Credit,(si.BillGrandTotal - isnull(tmpap.Applied,0)) Balance " +
                        ",isnull(tmpap.Applied,0) Paid,isnull(tmpap.AppliedEWT,0) PaidEWT,0 Credit,(si.BillGrandTotal - (isnull(tmpap.Applied,0) + isnull(tmpap.AppliedEWT,0))) Balance " +
                        selcol +
                        "from AppSalesInvoice si with (nolock) inner join AppClients c with (nolock) on c.Id = si.ClientId inner join AppStatusTypes st with (nolock) on st.Code = si.StatusId  and st.TransactionCode =103 " +
                        //"left outer join (select co.StatusId, SalesInvoiceId, sum(Amount) Applied from AppCollection co with (nolock) inner join AppCollectionApplied coap with (nolock) on co.Id = coap.COllectionId group by co.StatusId, SalesInvoiceId) tmpap on tmpap.SalesInvoiceId = si.Id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                        "left outer join (select SalesInvoiceId, sum(Amount) Applied, sum(ewtamount) appliedewt from AppCollection co with (nolock) inner join AppCollectionApplied coap with (nolock) on co.Id = coap.COllectionId " + 
                        wccol + " group by SalesInvoiceId) tmpap on tmpap.SalesInvoiceId = si.Id " + joincol + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);

                    return getAll;
                }
                else
                {
                    //var getAll = await _repositoryDapper.QueryAsync<vAccountsReceivable>(" select count(*) Over() TotalRows,si.*,c.Name Client, c.BusinessStyle, c.TaxNo, st.Status ,isnull(tmpap.Applied,0) Paid,0 Credit,(si.BillGrandTotal - isnull(tmpap.Applied,0)) Balance from AppSalesInvoice si with (nolock) inner join AppClients c with (nolock) on c.Id = si.ClientId inner join AppStatusTypes st with (nolock) on st.Code = si.StatusId  and st.TransactionCode =103 left outer join(select co.StatusId, SalesInvoiceId, sum(Amount) Applied from AppCollection co with (nolock) inner join AppCollectionApplied coap with (nolock) on co.Id = coap.COllectionId group by co.StatusId, SalesInvoiceId) tmpap on tmpap.SalesInvoiceId = si.Id " + wc + sort, dp);
                    var getAll = await _repositoryDapper.QueryAsync<vAccountsReceivable>(" select count(*) Over() TotalRows,si.*,c.Name Client, st.Status " +
                        //",isnull(tmpap.Applied,0) Paid,0 Credit,(si.BillGrandTotal - isnull(tmpap.Applied,0)) Balance " +
                        ",isnull(tmpap.Applied,0) Paid,isnull(tmpap.AppliedEWT,0) PaidEWT,0 Credit,(si.BillGrandTotal - (isnull(tmpap.Applied,0) + isnull(tmpap.AppliedEWT,0))) Balance " +
                        selcol +
                        "from AppSalesInvoice si with (nolock) inner join AppClients c with (nolock) on c.Id = si.ClientId inner join AppStatusTypes st with (nolock) on st.Code = si.StatusId  and st.TransactionCode =103 " +
                        //"left outer join (select co.StatusId, SalesInvoiceId, sum(Amount) Applied from AppCollection co with (nolock) inner join AppCollectionApplied coap with (nolock) on co.Id = coap.COllectionId group by co.StatusId, SalesInvoiceId) tmpap on tmpap.SalesInvoiceId = si.Id " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                        "left outer join (select SalesInvoiceId, sum(Amount) Applied, sum(ewtamount) appliedewt from AppCollection co with (nolock) inner join AppCollectionApplied coap with (nolock) on co.Id = coap.COllectionId " +
                        wccol + " group by SalesInvoiceId) tmpap on tmpap.SalesInvoiceId = si.Id " + joincol + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
        public async Task<SalesInvoice> GetByIdAsync(int id)
        {
            string wc = " Where si.Id = @Id ";
            string wc2 = "where id != @Id2 and isdeleted = 0 and statusid< 5 group by SalesOrderId ";

             var dp = new DynamicParameters();
            dp.Add("@Id", id);
            dp.Add("@Id2", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<SalesInvoice>(" select count(*) Over() TotalRows,si.*,c.Name Client,ss.Status, 	CONVERT(VARCHAR(10), TransactionTime, 101) TransactionTimeF,e.FirstName + ' ' + e.LastName SalesAgent, " +
                                                                               // "isnull(tmpsi.billedcharges, 0) BillOtherCharges,isnull(tmpsi.billeddiscount, 0) BillOtherDiscount,isnull(tmpsi.billednettotal, 0) BillNetTotal,isnull(tmpsi.billedtax, 0) BillTax, " +
                                                                                "OtherCharges - (isnull(tmpsi.billedcharges, 0)) BalanceOtherCharges, OtherDiscount - (isnull(tmpsi.billeddiscount, 0)) BillDiscountBalance, " +
                                                                                "NetTotal - (isnull(tmpsi.billednettotal, 0)) BillNetBalance, Tax - (isnull(tmpsi.billedtax, 0)) BillTaxBalance, isnull(tmpsi.billedsubtotal, 0) BilledSubTotal, " +
                                                                                "SubTotal - (isnull(tmpsi.billedsubtotal, 0)) BillSubBalance, isnull(tmpsi.billedgrandtotal, 0) BilledGrandTotal, " +
                                                                                "GrandTotal - isnull(tmpsi.billedgrandtotal, 0) BillGrandBalance  " +
                                                                                "from appsalesinvoice si with (nolock) inner join appclients c with (nolock) on c.id = si.clientid inner join appseriestype st with (nolock) on st.id = si.SeriesTypeId inner join appstatustypes ss with (nolock) on ss.code = si.StatusId and ss.transactioncode = 103 inner join AppEmployee e with (nolock) on e.Id = si.SalesAgentId " +
                                                                                "left outer join (select salesorderid, sum(billothercharges) billedcharges, sum(billotherdiscount) billedDiscount, sum(billnettotal) billednettotal, sum(billtax) billedtax, sum(billsubtotal) billedsubtotal, sum(billgrandtotal) billedgrandtotal from appsalesinvoice " + wc2 + ") tmpsi on si.salesorderid = tmpsi.salesorderid " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(SalesInvoice entity)
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
