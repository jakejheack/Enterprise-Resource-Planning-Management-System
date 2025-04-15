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


namespace ezinvmvc.App.Stocks
{
   public class StockEntryManager : DomainService, IStockEntryManager
    {
        private readonly IRepository<StockEntry> _repository;
        private readonly IDapperRepository<StockEntry> _repositoryDapper;
        public StockEntryManager(IRepository<StockEntry> repository, IDapperRepository<StockEntry> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(StockEntry entity)
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

        public async Task<IEnumerable<StockEntry>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string id = "";
            string entrytype = "";
            string status = "";
            string startdate = "";
            string enddate = "";
            string source = "";
            string destination = "";

          
            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    id = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    entrytype = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    status = tokens[2].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[3].ToString() != "null" && tokens[4].ToString() != "null")
                {
                    startdate = tokens[3].ToString();
                    enddate = tokens[4].ToString();
                }
            }
            if (tokens.Length > 5)
            {
                if (tokens[5].ToString() != "null")
                {
                    source = tokens[5].ToString();
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    destination = tokens[6].ToString();
                }
            }
            string wc = " Where se.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (id != "")
            {
                wc = wc + " And se.code like @Id ";
                dp.Add("@Id", "%" + id + "%");
            }

            if (entrytype != "")
            {
                entrytype = "'" + entrytype.Replace(",", "','") + "'";
                wc = wc + " And se.EntryTypeId  in (" + entrytype + ") ";
            }
            if (status != "")
            {
                status = "'" + status.Replace(",", "','") + "'";
                wc = wc + " And se.statusid  in (" + status + ") ";
            }

            if (startdate != "" && enddate != "")
            {
                wc = wc + " And se.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(startdate).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(enddate).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (source != "")
            {
                source = "'" + source.Replace(",", "','") + "'";
                wc = wc + " And se.DefaultSourceId  in (" + source + ") ";
            }
            if (destination != "")
            {
                destination = "'" + destination.Replace(",", "','") + "'";
                wc = wc + " And se.DefaultDestinationId  in (" + destination + ") ";
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
                sort = " order by se.Id asc";
            }

            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<StockEntry>("select count(*) Over() TotalRows,se.*,et.Name EntryType,ss.Status,sw.Name DefaultSource,dw.Name DefaultDestination,it.name InventoryType  from appstockentry se inner join appseriestype st on st.id = se.SeriesTypeId inner join appentrytypes et on et.id = se.entrytypeid inner join appstatustypes ss on ss.code = se.StatusId and ss.transactioncode = 107 inner join appwarehouses sw on sw.id = se.DefaultSourceId inner join appwarehouses dw on dw.id = se.DefaultDestinationId inner join appinventorytype it on it.Id = se.inventorytypeid  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //MARC LEEPE 01112023 warehouse text fix
                    //var getAll = await _repositoryDapper.QueryAsync<StockEntry>("select count(*) Over() TotalRows,se.*,et.Name EntryType,ss.Status, case when se.EntryTypeId = 3 then sw.Name else c.Name end DefaultSource, case when se.EntryTypeId = 3 then dw.Name else c.Name end DefaultDestination,it.name InventoryType  from appstockentry se inner join appseriestype st on st.id = se.SeriesTypeId inner join appentrytypes et on et.id = se.entrytypeid inner join appstatustypes ss on ss.code = se.StatusId and ss.transactioncode = 107 inner join appwarehouses sw on sw.id = se.DefaultSourceId inner join appinventorytype it on it.Id = se.inventorytypeid left join appwarehouses dw on dw.id = se.DefaultDestinationId left join AppClients c on c.id = se.DefaultDestinationId   " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryDapper.QueryAsync<StockEntry>("select count(*) Over() TotalRows,se.*,et.Name EntryType,ss.Status, case when (se.EntryTypeId = 3 or se.entrytypeid = 2) then (case when (se.entrytypeid = 2 and se.inventorytypeid=5) then c.name else sw.Name end) else sw.Name end DefaultSource, case when (se.EntryTypeId = 3 or se.entrytypeid = 2) then (case when (se.entrytypeid=2 or se.inventorytypeid=5) then sw.name else dw.Name end) else (case when (se.inventorytypeid=1 or se.inventorytypeid=2) then c.name else dw.Name end) end DefaultDestination,it.name InventoryType  from appstockentry se inner join appseriestype st on st.id = se.SeriesTypeId inner join appentrytypes et on et.id = se.entrytypeid inner join appstatustypes ss on ss.code = se.StatusId and ss.transactioncode = 107 inner join appwarehouses sw on sw.id = se.DefaultSourceId inner join appinventorytype it on it.Id = se.inventorytypeid left join appwarehouses dw on dw.id = se.DefaultDestinationId left join AppClients c on c.id = se.DefaultDestinationId   " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);

                    var getAll = await _repositoryDapper.QueryAsync<StockEntry>(" select count(*) Over() TotalRows,se.*,et.Name EntryType,ss.Status, case when (se.EntryTypeId = 3 or se.entrytypeid = 2) then (case when (se.entrytypeid = 2 and se.inventorytypeid=5) then c.name else sw.Name end) else sw.Name end DefaultSource, case when (se.EntryTypeId = 3 or se.entrytypeid = 2) then (case when (se.entrytypeid=2 or se.inventorytypeid=5) then sw.name else dw.Name end) else (case when (se.inventorytypeid=1 or se.inventorytypeid=2) then c.name else dw.Name end) end DefaultDestination,it.name InventoryType  from appstockentry se with (nolock) inner join appseriestype st with (nolock) on st.id = se.SeriesTypeId inner join appentrytypes et with (nolock) on et.id = se.entrytypeid inner join appstatustypes ss with (nolock) on ss.code = se.StatusId and ss.transactioncode = 107 inner join appwarehouses sw with (nolock) on sw.id = se.DefaultSourceId inner join appinventorytype it with (nolock) on it.Id = se.inventorytypeid left join appwarehouses dw with (nolock) on dw.id = se.DefaultDestinationId left join AppClients c with (nolock) on c.id = se.DefaultDestinationId " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<StockEntry>(" select count(*) Over() TotalRows,se.*,et.Name EntryType,ss.Status, case when (se.EntryTypeId = 3 or se.entrytypeid = 2) then (case when (se.entrytypeid = 2 and se.inventorytypeid=5) then c.name else sw.Name end) else sw.Name end DefaultSource, case when (se.EntryTypeId = 3 or se.entrytypeid = 2) then (case when (se.entrytypeid=2 or se.inventorytypeid=5) then sw.name else dw.Name end) else (case when (se.inventorytypeid=1 or se.inventorytypeid=2) then c.name else dw.Name end) end DefaultDestination,it.name InventoryType  from appstockentry se with (nolock) inner join appseriestype st with (nolock) on st.id = se.SeriesTypeId inner join appentrytypes et with (nolock) on et.id = se.entrytypeid inner join appstatustypes ss with (nolock) on ss.code = se.StatusId and ss.transactioncode = 107 inner join appwarehouses sw with (nolock) on sw.id = se.DefaultSourceId inner join appinventorytype it with (nolock) on it.Id = se.inventorytypeid left join appwarehouses dw with (nolock) on dw.id = se.DefaultDestinationId left join AppClients c with (nolock) on c.id = se.DefaultDestinationId " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<StockEntry> GetByIdAsync(int id)
        {
            string wc = " Where se.Id = @Id ";
            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<StockEntry>(" select se.*,ss.Status from appstockentry se with (nolock) inner join appstatustypes ss with (nolock) on ss.code = se.StatusId and ss.transactioncode = 107 " + wc, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(StockEntry entity)
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
