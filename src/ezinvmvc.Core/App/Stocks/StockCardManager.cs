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
   public    class StockCardManager : DomainService, IStockCardManager
    {
        private readonly IRepository<StockCard> _repository;
        private readonly IDapperRepository<StockCard> _repositoryDapper;
        public StockCardManager(IRepository<StockCard> repository, IDapperRepository<StockCard> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(StockCard entity)
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

        public async Task<IEnumerable<StockCard>> GetAllByParentId(int parentid)
        {
            string wc = " Where qi.quotationid = @parentid and qi.isdeleted = 0 ";

            string sort = " order by qi.Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<StockCard>("" + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<StockCard>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string id = "";//0
            string transactiontypeid = "";//1
            string transactionid = "";//2
            string transactionitemid = "";//3
            string transactioncode = "";//4
            string startdate = "";//5
            string enddate = "";//6
            string warehouse = "";//7

            string product = "";//8
            string category = "";//9
            string brand = "";//10


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
                    transactiontypeid = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    transactionid = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    transactionitemid = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    transactioncode = tokens[4].ToString();
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[5].ToString() != "null" && tokens[6].ToString() != "null")
                {
                    startdate = tokens[5].ToString();
                    enddate = tokens[6].ToString();
                }
            }
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    warehouse = tokens[7].ToString();
                }
            }
            if (tokens.Length > 8)
            {
                if (tokens[8].ToString() != "null")
                {
                    product = tokens[8].ToString();
                }
            }
            if (tokens.Length > 9)
            {
                if (tokens[9].ToString() != "null")
                {
                    category = tokens[9].ToString();
                }
            }
            if (tokens.Length > 10)
            {
                if (tokens[10].ToString() != "null")
                {
                    brand = tokens[10].ToString();
                }
            }
            string wc = " Where sc.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (id != "")
            {
                wc = wc + " And sc.id = @id ";
                dp.Add("@id", id);
            }
            if (transactiontypeid != "")
            {
                wc = wc + " And sc.transactiontypeid = @transactiontypeid ";
                dp.Add("@transactiontypeid", transactiontypeid);
            }
            if (transactionid != "")
            {
                wc = wc + " And sc.transactionid = @transactionid ";
                dp.Add("@transactionid", transactionid);
            }
            if (transactionitemid != "")
            {
                wc = wc + " And sc.transactionitemid = @transactionitemid ";
                dp.Add("@transactionitemid", transactionitemid);
            }
            if (transactioncode != "")
            {
                wc = wc + " And sc.transactioncode = @transactioncode ";
                dp.Add("@transactioncode", transactioncode);
            }
            if (startdate != "" && enddate != "")
            {
                wc = wc + " And sc.transactiontime  between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(startdate).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(enddate).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (warehouse != "")
            {
                warehouse = "'" + warehouse.Replace(",", "','") + "'";
                wc = wc + " And sc.warehouseid  in (" + warehouse + ") ";
            }
            if (product != "")
            {
                wc = wc + " And sc.productid = @product ";
                dp.Add("@product", product);
            }
            if (category != "")
            {
                category = "'" + category.Replace(",", "','") + "'";
                wc = wc + " And c.Id in (" + category + ") ";
            }
            if (brand != "")
            {
                brand = "'" + brand.Replace(",", "','") + "'";
                wc = wc + " And b.Id  in (" + brand + ") ";
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
                sort = " order by sc.Id asc";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<StockCard>("select  count(*) Over() TotalRows,t.Name TransactionType,sc.*,p.Name ProductName, p.Code ProductCode,c.Name ProductCategory, b.Name ProductBrand, u.Name Unit, w.Name Warehouse, (select sum(Qty) Balance from AppStockCard scb where scb.TransactionTime <= sc.TransactionTime and scb.ProductId = sc.ProductId and scb.UnitId = sc.UnitId and scb.WarehouseId = sc.WarehouseId) Balance from AppStockCard sc inner join AppProducts p on p.id = sc.ProductId inner join AppCategories c on c.id = p.CategoryId inner join AppBrands b on b.id = p.BrandId inner join AppUnits u on u.id = sc.UnitId inner join AppTransactions t on t.id = sc.TransactionTypeId inner join AppWarehouses w on w.Id = sc.WarehouseId " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryDapper.QueryAsync<StockCard>(" select  count(*) Over() TotalRows,t.Name TransactionType,sc.*,p.Name ProductName, p.Code ProductCode,c.Name ProductCategory, b.Name ProductBrand, u.Name Unit, w.Name Warehouse, (select sum(Qty) Balance from AppStockCard scb with (nolock) where scb.TransactionTime <= sc.TransactionTime and scb.ProductId = sc.ProductId and scb.UnitId = sc.UnitId and scb.WarehouseId = sc.WarehouseId) Balance, st.Name as TransactionName from AppStockCard sc with (nolock) inner join AppProducts p with (nolock) on p.id = sc.ProductId inner join AppCategories c with (nolock) on c.id = p.CategoryId inner join AppBrands b with (nolock) on b.id = p.BrandId inner join AppUnits u with (nolock) on u.id = sc.UnitId inner join AppTransactions t with (nolock) on t.id = sc.TransactionTypeId inner join AppWarehouses w with (nolock) on w.Id = sc.WarehouseId inner join vStocksTransactions st with (nolock) on st.id=sc.TransactionId and st.code=sc.TransactionCode " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<StockCard>(" select  count(*) Over() TotalRows,t.Name TransactionType,sc.*,p.Name ProductName, p.Code ProductCode,c.Name ProductCategory, b.Name ProductBrand, u.Name Unit, w.Name Warehouse, (select sum(Qty) Balance from AppStockCard scb with (nolock) where scb.TransactionTime <= sc.TransactionTime and scb.ProductId = sc.ProductId and scb.UnitId = sc.UnitId and scb.WarehouseId = sc.WarehouseId) Balance, st.Name as TransactionName from AppStockCard sc with (nolock) inner join AppProducts p with (nolock) on p.id = sc.ProductId inner join AppCategories c with (nolock) on c.id = p.CategoryId inner join AppBrands b with (nolock) on b.id = p.BrandId inner join AppUnits u with (nolock) on u.id = sc.UnitId inner join AppTransactions t with (nolock) on t.id = sc.TransactionTypeId inner join AppWarehouses w with (nolock) on w.Id = sc.WarehouseId inner join vStocksTransactions st with (nolock) on st.id=sc.TransactionId and st.code=sc.TransactionCode " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<StockSummary>> GetAllSummary(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string warehouse = "";//0
            string product = "";//1
            string category = "";//2
            string brand = "";//3
            
            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    warehouse = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    product = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    category = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    brand = tokens[3].ToString();
                }
            }
            string wc = " Where sc.isdeleted = 0 ";
            var dp = new DynamicParameters();
            if (warehouse != "")
            {
                warehouse = "'" + warehouse.Replace(",", "','") + "'";
                wc = wc + " And sc.warehouseid  in (" + warehouse + ") ";
            }
            if (product != "")
            {
                wc = wc + " And sc.productid = @product ";
                dp.Add("@product", product);
            }
            if (category != "")
            {
                category = "'" + category.Replace(",", "','") + "'";
                wc = wc + " And c.Id in (" + category + ") ";
            }
            if (brand != "")
            {
                brand = "'" + brand.Replace(",", "','") + "'";
                wc = wc + " And b.Id  in (" + brand + ") ";
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
                sort = " order by p.Code asc";
            }
            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<StockSummary>(" select sc.ProductId, p.Code ProductCode,p.Name ProductName,p.Description,c.Name ProductCategory, b.Name ProductBrand, p.AlertLevel,u.Name Unit,w.Name Warehouse, sum(Cast(sc.Qty as DEC(9,0))) as Qty,p.AlertLevel,p.ImageName,count(*) Over() TotalRows from AppStockCard sc with (nolock) inner join AppProducts p with (nolock) on sc.ProductId = p.Id inner join AppCategories c with (nolock) on c.Id = p.CategoryId inner join AppBrands b with (nolock) on b.id = p.BrandId inner join AppWarehouses w with (nolock) on w.id = sc.WarehouseId inner join AppUnits u with (nolock) on u.Id = sc.UnitId " + wc + " Group by sc.ProductId,sc.UnitId,sc.WarehouseId,p.Code,p.Name,p.Description,c.Name, b.Name,p.AlertLevel,p.ImageName,u.Name,w.Name " + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<StockSummary>(" select sc.ProductId, p.Code ProductCode,p.Name ProductName,p.Description,c.Name ProductCategory, b.Name ProductBrand, p.AlertLevel,u.Name Unit,w.Name Warehouse, sum(Cast(sc.Qty as DEC(9,0))) as Qty,p.AlertLevel,p.ImageName,count(*) Over() TotalRows from AppStockCard sc with (nolock) inner join AppProducts p with (nolock) on sc.ProductId = p.Id inner join AppCategories c with (nolock) on c.Id = p.CategoryId inner join AppBrands b with (nolock) on b.id = p.BrandId inner join AppWarehouses w with (nolock) on w.id = sc.WarehouseId inner join AppUnits u with (nolock) on u.Id = sc.UnitId " + wc + " Group by sc.ProductId,sc.UnitId,sc.WarehouseId,p.Code,p.Name,p.Description,c.Name, b.Name,p.AlertLevel,p.ImageName,u.Name,w.Name " + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<StockCard> GetByIdAsync(int id)
        {
            string wc = " Where q.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<StockCard>(" select  count(*) Over() TotalRows,t.Name TransactionType,sc.*,p.Name ProductName, p.Code ProductCode,c.Name ProductCategory, b.Name ProductBrand, u.Name Unit, w.Name Warehouse, (select sum(Qty) Balance from AppStockCard scb with (nolock) where scb.TransactionTime <= sc.TransactionTime and scb.ProductId = sc.ProductId and scb.UnitId = sc.UnitId and scb.WarehouseId = sc.WarehouseId) Balance, st.Name as TransactionName from AppStockCard sc with (nolock) inner join AppProducts p with (nolock) on p.id = sc.ProductId inner join AppCategories c with (nolock) on c.id = p.CategoryId inner join AppBrands b with (nolock) on b.id = p.BrandId inner join AppUnits u with (nolock) on u.id = sc.UnitId inner join AppTransactions t with (nolock) on t.id = sc.TransactionTypeId inner join AppWarehouses w with (nolock) on w.Id = sc.WarehouseId inner join vStocksTransactions st with (nolock) on st.id=sc.TransactionId and st.code=sc.TransactionCode " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(StockCard entity)
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
