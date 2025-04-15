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
using Abp.Authorization;

namespace ezinvmvc.App.Clients
{
    public class ClientManager : DomainService, IClientManager
    {
        private readonly IRepository<Client> _repository;
        private readonly IDapperRepository<Client> _repositoryDapper;
        private readonly IPermissionChecker _permissionChecker;

        public ClientManager(IRepository<Client> repository, IDapperRepository<Client> repositoryDapper, IPermissionChecker permissionChecker)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
            _permissionChecker = permissionChecker;
        }
        public async Task<IdentityResult> CreateAsync(Client entity)
        {
            var result = _repository.FirstOrDefault(x => x.Name == entity.Name);
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

        public async Task<IEnumerable<Client>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');
            string clientfilter = "", statusfilter = "", accountexecutive = "", aefilter = "", accountstypefilter = "";
            if(tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    clientfilter = tokens[0];
                }
            }
            if(tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    statusfilter = tokens[1];
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    accountexecutive = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    aefilter = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    accountstypefilter = tokens[4].ToString();
                }
            }

            string wc = " Where isdeleted = 0 ", qp = "";
            var dp = new DynamicParameters();
            //if (filter != null && filter.Trim() != "")
            //{
            //    wc = wc + " And (v.name like @Filter) ";
            //}
            if (clientfilter != "")
            {
                wc = wc + " And (v.name like @Filter) ";
                dp.Add("@Filter", "%" + clientfilter + "%");
            }
            if(statusfilter != "")
            {
                wc = wc + " And v.StatusId in (" + statusfilter + ")";
            }
            //if (accountexecutive != "")
            //{
            //    //wc = wc + " And v.AssignedToId = @empid ";
            //    //dp.Add("@empid", Convert.ToInt32(accountexecutive));
            //    if (!_permissionChecker.IsGranted("Master.Clients.AllAccounts"))
            //    {
            //        if (_permissionChecker.IsGranted("Master.Clients.AccountExecutive"))
            //        {
            //            qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
            //             "UNION ALL " +
            //             "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";
            //            if (aefilter != "")
            //            {
            //                wc = wc + " AND v.AssignedToid in (" + aefilter + ") ";
            //            }
            //            else
            //            {
            //                wc = wc + " AND v.AssignedToid in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";
            //            }

            //            //wc = wc + " And r.id = @empid ";
            //            dp.Add("@empid", Convert.ToInt32(accountexecutive));
            //            dp.Add("@mempid", Convert.ToInt32(accountexecutive));
            //        }
            //    }
            //    else
            //    {
            //        if (aefilter != "")
            //        {
            //            wc = wc + " AND v.AssignedToid in (" + aefilter + ") ";
            //        }
            //    }
            //}
            if (accountstypefilter != "")
            {
                if (accountstypefilter == "1")
                {
                    wc = wc + " And v.AssignedToId = @empid ";
                    dp.Add("@empid", Convert.ToInt32(accountexecutive));
                }
                else if (accountstypefilter == "2")
                {
                    //if (!_permissionChecker.IsGranted("Master.Clients.AllAccounts"))
                    //{
                    //    if (_permissionChecker.IsGranted("Master.Clients.AccountExecutive"))
                    //    {
                    qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                     "UNION ALL " +
                     "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";
                    //wc = wc + " AND v.AssignedToid in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";

                    ////wc = wc + " And r.id = @empid ";
                    //dp.Add("@empid", Convert.ToInt32(ae));
                    //dp.Add("@mempid", Convert.ToInt32(ae));
                    //    }
                    //}

                    if (aefilter != "")
                    {
                        wc = wc + " AND v.AssignedToid in (" + aefilter + ") ";
                    }
                    else
                    {
                        wc = wc + " AND v.AssignedToid in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";
                    }

                    //wc = wc + " And r.id = @empid ";
                    dp.Add("@empid", Convert.ToInt32(accountexecutive));
                    dp.Add("@mempid", Convert.ToInt32(accountexecutive));
                }
                else if (accountstypefilter == "3")
                {
                    if (aefilter != "")
                    {
                        wc = wc + " AND v.AssignedToid in (" + aefilter + ") ";
                    }
                }
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
                sort = " order by id asc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Client>("select count(*) Over() TotalRows,v.* from appclients v " + wc + sort + " Limit " + offset + "," + fetch, dp);
                    var getAll = await _repositoryDapper.QueryAsync<Client>(qp + "select count(*) Over() TotalRows, FORMAT(v.Id, '000000000#') AS refNo, v.* from (SELECT c.*, c.Address + ', ' + cty.Name + ', ' + prv.Name + ', ' + ctr.Name AS CompleteAddress, i.name as industry, vat.name as VatType, ctr.name as Country, prv.Name as Province, cty.Name as City, cmp.Name as Company, st.Status, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName AS AssignedTo from appclients as c inner join appindustries as i on c.IndustryId=i.Id inner join apptaxtypes as vat on c.VATtypeId=vat.id inner join appcountries as ctr on c.countryid=ctr.id inner join appprovinces as prv on c.provinceid=prv.id inner join appcities as cty on c.cityid=cty.id inner join appcompany as cmp on c.companyid=cmp.id INNER JOIN AppStatusTypes st ON c.StatusId=st.Code AND st.TransactionCode = 105 LEFT OUTER JOIN AppEmployee AS e ON c.AssignedToId=e.Id) v " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Client>(qp + "select count(*) Over() TotalRows, FORMAT(v.Id, '000000000#') AS refNo, v.* from (SELECT c.*, c.Address + ', ' + cty.Name + ', ' + prv.Name + ', ' + ctr.Name AS CompleteAddress, i.name as industry, vat.name as VatType, ctr.name as Country, prv.Name as Province, cty.Name as City, cmp.Name as Company, st.Status, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName AS AssignedTo from appclients as c inner join appindustries as i on c.IndustryId=i.Id inner join apptaxtypes as vat on c.VATtypeId=vat.id inner join appcountries as ctr on c.countryid=ctr.id inner join appprovinces as prv on c.provinceid=prv.id inner join appcities as cty on c.cityid=cty.id inner join appcompany as cmp on c.companyid=cmp.id INNER JOIN AppStatusTypes st ON c.StatusId=st.Code AND st.TransactionCode = 105 LEFT OUTER JOIN AppEmployee AS e ON c.AssignedToId=e.Id) v " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Client>> GetAllClientList()
        {
            return await _repository.GetAllListAsync();
        }

        public async Task<Client> GetByIdAsync(int id)
        {
            //var result = _repository.FirstOrDefault(x => x.Id == id);
            //if (result != null)
            //{
            //    return await _repository.GetAsync(id);
            //}
            //else
            //{
            //    throw new UserFriendlyException("No Data Found!");
            //}
            string wc = " Where c.Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Client>("SELECT c.*, c.Address + ', ' + cty.Name + ', ' + prv.Name + ', ' + ctr.Name AS CompleteAddress, i.name as industry, vat.name as VatType, ctr.name as Country, prv.Name as Province, cty.Name as City, cmp.Name as Company, st.Status, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName AS AssignedTo from appclients as c inner join appindustries as i on c.IndustryId=i.Id inner join apptaxtypes as vat on c.VATtypeId=vat.id inner join appcountries as ctr on c.countryid=ctr.id inner join appprovinces as prv on c.provinceid=prv.id inner join appcities as cty on c.cityid=cty.id inner join appcompany as cmp on c.companyid=cmp.id INNER JOIN AppStatusTypes st ON c.StatusId=st.Code AND st.TransactionCode = 105 LEFT OUTER JOIN AppEmployee AS e ON c.AssignedToId=e.Id " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Client> GetBillingAddressAsync(int id)
        {
            string wc = " Where Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Client>("select Address as Code, DeliveryAddress as CompleteAddress from AppRFQ " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }


        public async Task<Client> GetSIBillingAddressAsync(int id)
        {
            string wc = " Where Id = @Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Client>(" select BillingAddress as Code, DeliveryAddress as RequestCode from AppSalesOrders " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }


        public async Task<IEnumerable<Client>> GetDetailsByIdAsync(int id)
        {
            string wc = " Where isdeleted = 0 ";
            var dp = new DynamicParameters();
            if (id > 0)
            {
                wc = wc + " And (v.id = @Filter) ";
                dp.Add("@Filter", id);
            }

            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Client>("select count(*) Over() TotalRows, FORMAT(v.Id, '000000000#') AS refNo, v.* from (SELECT c.*, c.Address + ', ' + cty.Name + ', ' + prv.Name + ', ' + ctr.Name AS CompleteAddress, i.name as industry, vat.name as VatType, ctr.name as Country, prv.Name as Province, cty.Name as City, cmp.Name as Company, st.Status, e.FirstName + ' ' + e.MiddleName + ' ' + e.LastName AS AssignedTo from appclients as c inner join appindustries as i on c.IndustryId=i.Id inner join apptaxtypes as vat on c.VATtypeId=vat.id inner join appcountries as ctr on c.countryid=ctr.id inner join appprovinces as prv on c.provinceid=prv.id inner join appcities as cty on c.cityid=cty.id inner join appcompany as cmp on c.companyid=cmp.id INNER JOIN AppStatusTypes st ON c.StatusId=st.Code AND st.TransactionCode = 105 LEFT OUTER JOIN AppEmployee AS e ON c.AssignedToId=e.Id) v " + wc, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Client entity)
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
