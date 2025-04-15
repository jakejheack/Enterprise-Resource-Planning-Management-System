using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Runtime.Session;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;

namespace ezinvmvc.App.Employees
{
    public class EmployeeManager : DomainService, IEmployeeManager
    {
        private readonly IRepository<Employee> _repositoryEmployee;
        private readonly IDapperRepository<Employee> _repositoryEmployeeDapper;
        private readonly IPermissionChecker _permissionChecker;
        private readonly IAbpSession _session;

        public EmployeeManager(IRepository<Employee> repository, IDapperRepository<Employee> repositoryDapper, IPermissionChecker permissionChecker, IAbpSession session)
        {
            _repositoryEmployee = repository;
            _repositoryEmployeeDapper = repositoryDapper;
            _permissionChecker = permissionChecker;
            _session = session;
        }

        public async Task<IdentityResult> CreateAsync(Employee entity)
        {
            var result = _repositoryEmployee.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployee.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {
            var result = _repositoryEmployee.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryEmployee.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IEnumerable<Employee>> GetAgents(string name)
        {
            //string wc = " Where a.isdeleted = '0' and isagent = 1 and (a.Firstname like @name or a.MiddleName like @name or a.LastName like @name) ";
            string wc = " Where a.isdeleted = '0' and (a.Firstname like @name or a.MiddleName like @name or a.LastName like @name) ";
            string sort = " order by CompleteName asc ";
            var dp = new DynamicParameters();
            dp.Add("@name", "%" + name + "%");
            try
            {
                IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select a.*,a.FirstName+' '+ a.LastName as CompleteName from appemployee as a " + wc + sort, dp);
                return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeeAsync()
        {
            string wc = " Where isdeleted = 0 ";
            string sort = " order by Id asc ";
            var dp = new DynamicParameters();
            try
            {
                IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("Select *,FirstName+' '+ MiddleName+' '+ LastName as UserFullName from appemployee " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetAllSalescordinator(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');

            string ddFilter = "";
            string TxtFilter = "";

            if (tokens[0].ToString() != "null")
            {
                ddFilter = tokens[0].ToString();
            }
            if (tokens[1].ToString() != "null")
            {
                TxtFilter = tokens[1].ToString();
            }
            //end//

            //string wc = " Where a.isdeleted = '0' ";
            //if (filter != "")
            //{
            //    wc = wc + " And  ( a.FirstName+' '+ a.MiddleName+' '+ a.LastName like @Filter ) ";
            //}

            //start//


            var dp = new DynamicParameters();

            //string wc = " Where a.isdeleted = '0' and f.TransactionCode = '108' and  ur.rolaname = 'Sales Coordinator'";
            string wc = " Where a.isdeleted = '0' and f.TransactionCode = '108'";
            if (ddFilter == "CompleteName")
            {
                wc = wc + " And  ( a.FirstName+' '+ a.MiddleName+' '+ a.LastName like @Filter2 ) ";
            }
            if (ddFilter == "Department")
            {
                wc = wc + " And ( b.Description like @Filter2 ) ";
            }
            if (ddFilter == "Division")
            {
                wc = wc + " And ( c.Description like @Filter2 ) ";
            }
            if (ddFilter == "Sectors")
            {
                wc = wc + " And ( d.Description like @Filter2 ) ";
            }
            if (ddFilter == "Position")
            {
                wc = wc + " And ( e.Description like @Filter2 ) ";
            }
            if (ddFilter == "UserId")
            {
                wc = wc + " And a.UserId = @Filter3 ";
            }
            //end
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " asc ";
            }
            else
            {
                sort = " order by CompleteName asc ";
            }
            dp.Add("@Filter", "%" + filter + "%");
            dp.Add("@Filter2", "%" + TxtFilter + "%");
            dp.Add("@Filter3", TxtFilter);
            //dp.Add("@Filter2", FullNameFilter);
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("Select * from AppEmployee " + wc + sort, dp);
                    //IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) inner join AbpUserRoles as ur on ur.UserId = a.UserId Left outer join AppDepartment as b on a.DepartmentId = b.Id Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) inner join (select aur.*, ar.Name rolaname from AbpUserRoles aur inner join AbpRoles ar on ar.Id = aur.RoleId) ur on ur.UserId = a.UserId  Left outer join AppDepartment as b on a.DepartmentId = b.Id  Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code  " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) inner join (select aur.*, ar.Name rolaname from AbpUserRoles aur inner join AbpRoles ar on ar.Id = aur.RoleId) ur on ur.UserId = a.UserId  Left outer join AppDepartment as b on a.DepartmentId = b.Id  Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');

            string ddFilter = "";
            string TxtFilter = "";

            if (tokens[0].ToString() != "null")
            {
                ddFilter = tokens[0].ToString();
            }
            if (tokens[1].ToString() != "null")
            {
                TxtFilter = tokens[1].ToString();
            }
            //end//

            //string wc = " Where a.isdeleted = '0' ";
            //if (filter != "")
            //{
            //    wc = wc + " And  ( a.FirstName+' '+ a.MiddleName+' '+ a.LastName like @Filter ) ";
            //}

            //start//


            var dp = new DynamicParameters();

            string wc = " Where a.isdeleted = '0' and f.TransactionCode = '108'";

            if (ddFilter == "CompleteName")
            {
                wc = wc + " And  ( a.FirstName+' '+ a.MiddleName+' '+ a.LastName like @Filter2 ) ";
            }
            if (ddFilter == "Department")
            {
                wc = wc + " And ( b.Description like @Filter2 ) ";
            }
            if (ddFilter == "Division")
            {
                wc = wc + " And ( c.Description like @Filter2 ) ";
            }
            if (ddFilter == "Sectors")
            {
                wc = wc + " And ( d.Description like @Filter2 ) ";
            }
            if (ddFilter == "Position")
            {
                wc = wc + " And ( e.Description like @Filter2 ) ";
            }
            if (ddFilter == "UserId")
            {
                wc = wc + " And a.UserId = @Filter3 ";
            }
            if (ddFilter == "EmployeeCode")
            {
                wc = wc + " And a.EmployeeCode = @Filter2 ";
            }

            //if (ddFilter == "CompleteName")
            //{
            //    wc = wc + " And  ( a.FirstName+' '+ a.MiddleName+' '+ a.LastName like @Filter2 ) ";
            //}

            //if (ddFilter == "Department")
            //{
            //    wc = wc + " And ( b.Name like @Filter2 ) ";
            //}
            //if (ddFilter == "Division")
            //{
            //    wc = wc + " And ( c.Name like @Filter2 ) ";
            //}
            //if (ddFilter == "Sectors")
            //{
            //    wc = wc + " And ( d.Name like @Filter2 ) ";
            //}
            //if (ddFilter == "Position")
            //{
            //    wc = wc + " And ( e.Name like @Filter2 ) ";
            //}
            //if (ddFilter == "UserId")
            //{
            //    wc = wc + " And a.employeecode = @Filter2 ";
            //}
            //end
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " asc ";
            }
            else
            {
                sort = " order by CompleteName asc ";
            }
            dp.Add("@Filter", "%" + filter + "%");
            dp.Add("@Filter2", "%" + TxtFilter + "%");
            dp.Add("@Filter3", TxtFilter);
            //dp.Add("@Filter2", FullNameFilter);
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("Select * from AppEmployee " + wc + sort, dp);
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code" + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetAllUserList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');

            string username = "", empid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null" && tokens[0].Trim() != "")
                {
                    username = tokens[0].Trim();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    empid = tokens[1].Trim();
                }
            }

            string wc = " Where b.isdeleted = 0 and isnull(a.isdeleted,0) = 0 and b.TenantId is null ";
            string wc2 = " Where b.isdeleted = 0 and isnull(a.isdeleted,0) = 0 and b.TenantId is null and a.UserId is null ";
            if (empid != "" && empid != null)
            {
                wc = wc + " AND a.Id = @empid ";
            }
            if (username != "" && username != null)
            {
                wc2 = wc2 + " AND b.UserName like @username ";
            }
            //end
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
                sort = " order by UserName asc ";
            }
            var dp = new DynamicParameters();
            dp.Add("@username", "%" + username + "%");
            dp.Add("@empid", empid);
            //dp.Add("@Filter2", FullNameFilter);
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("Select * from AppEmployee " + wc + sort, dp);
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("Select a.*, b.Id as UserUserId, b.UserName, b.Name + ' ' + b.Surname AS UserFullName, b.EmailAddress as UserEmailAddress from Appemployee as a right outer join AbpUsers as b on b.Id=a.UserId " + wc + "UNION " +
                        "Select a.*, b.Id as UserUserId, b.UserName, b.Name + ' ' + b.Surname AS UserFullName, b.EmailAddress as UserEmailAddress from Appemployee as a right outer join AbpUsers as b on b.Id=a.UserId " + wc2 + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("Select a.*, b.Id as UserUserId, b.UserName, b.Name + ' ' + b.Surname AS UserFullName, b.EmailAddress as UserEmailAddress from Appemployee as a right outer join AbpUsers as b on b.Id=a.UserId " + wc + "UNION " +
                        "Select a.*, b.Id as UserUserId, b.UserName, b.Name + ' ' + b.Surname AS UserFullName, b.EmailAddress as UserEmailAddress from Appemployee as a right outer join AbpUsers as b on b.Id=a.UserId " + wc2 + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Employee> GetByIdAsync(int id)
        {
            var result = _repositoryEmployee.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                return await _repositoryEmployee.GetAsync(id);
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateAsync(Employee entity)
        {
            try
            {
                await _repositoryEmployee.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }


        public async Task<IEnumerable<Employee>> GetAllAttendanceList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');

            string ddFilter = "";
            string TxtFilter = "";
            string e = "";

            if (tokens[0].ToString() != "null")
            {
                ddFilter = tokens[0].ToString();
            }
            if (tokens[1].ToString() != "null")
            {
                TxtFilter = tokens[1].ToString();
            }
            
            if (tokens[2].ToString() != "null")
            {
                e = tokens[2].ToString();
            }

            var dp = new DynamicParameters();

            string wc = " Where a.isdeleted = '0' and f.TransactionCode = '108' and a.Id not in (select EmpId as Id from AppEmployeeAttRecord where Attid = @e  and IsDeleted = '0') ";
            if (ddFilter == "CompleteName")
            {
                wc = wc + " And  ( a.FirstName+' '+ a.MiddleName+' '+ a.LastName like @Filter2 ) ";
            }
            if (ddFilter == "Department")
            {
                wc = wc + " And ( b.Description like @Filter2 ) ";
            }
            if (ddFilter == "Division")
            {
                wc = wc + " And ( c.Description like @Filter2 ) ";
            }
            if (ddFilter == "Sectors")
            {
                wc = wc + " And ( d.Description like @Filter2 ) ";
            }
            if (ddFilter == "Position")
            {
                wc = wc + " And ( e.Description like @Filter2 ) ";
            }
            if (ddFilter == "UserId")
            {
                wc = wc + " And a.UserId = @Filter3 ";
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " asc ";
            }
            else
            {
                sort = " order by CompleteName asc ";
            }
            dp.Add("@e",e);
            dp.Add("@Filter", "%" + filter + "%");
            dp.Add("@Filter2", "%" + TxtFilter + "%");
            dp.Add("@Filter3", TxtFilter);
            try
            {
                if (!forexport)
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code" + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetAccountExecutives(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');

            string managerFilter = "";
            string aeFilter = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    managerFilter = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    aeFilter = tokens[1].ToString();
                }
            }

            var dp = new DynamicParameters();
            
            string wc = " Where a.isdeleted = '0' ", qp = "";
           
            //if (managerFilter != "" && managerFilter != "null")
            //{
            //    wc = wc + " And a.UserId = @Filter3 ";
            //    dp.Add("@Filter", "%" + filter + "%");
            //}
            //if (aeFilter != "" && aeFilter != "null")
            //{
            //    wc = wc + " And a.UserId = @Filter3 ";
            //    dp.Add("@Filter", "%" + filter + "%");
            //}

            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " asc ";
            }
            else
            {
                sort = " order by CompleteName asc ";
            }

            if (managerFilter != "" && managerFilter != "null" && managerFilter != "-1")
            {
                if (!_permissionChecker.IsGranted("CRM.Leads.AllAccounts"))
                {
                    if (_permissionChecker.IsGranted("CRM.Leads.AccountExecutive"))
                    {
                        qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                         "UNION ALL " +
                         "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";
                        wc = wc + " AND a.id in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";

                        //wc = wc + " And r.id = @empid ";
                        dp.Add("@empid", Convert.ToInt32(managerFilter));
                        dp.Add("@mempid", Convert.ToInt32(managerFilter));
                        //wc = wc + " And e.Id  = @empid ";
                        //dp.Add("@empid", accountexecutive);
                    }
                }
            }

            try
            {
                if (!forexport)
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>(qp + "select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id  Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code and f.TransactionCode = '108'  " + wc + sort, dp); //+ " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>(qp + "select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id  Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code and f.TransactionCode = '108' " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetAll(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');

            string ddFilter = "";
            string TxtFilter = "";
            string Status = "";

            if (tokens[0].ToString() != "null")
            {
                ddFilter = tokens[0].ToString();
            }
            if (tokens[1].ToString() != "null")
            {
                TxtFilter = tokens[1].ToString();
            }
            if (tokens[2].ToString() != "null")
            {
                Status = tokens[2].ToString();
            }

            //start//

            var dp = new DynamicParameters();
            string wc2 = "";
            string wc = " Where a.isdeleted = '0' and f.TransactionCode = '108'";
            if (ddFilter == "CompleteName")
            {
                wc = wc + " And  ( a.FirstName+' '+ a.MiddleName+' '+ a.LastName like @Filter2 ) ";
            }
            if (ddFilter == "Department")
            {
                wc = wc + " And ( b.Name like @Filter2 ) ";
            }
            if (ddFilter == "Division")
            {
                wc = wc + " And ( c.Name like @Filter2 ) ";
            }
            if (ddFilter == "Sectors")
            {
                wc = wc + " And ( d.Name like @Filter2 ) ";
            }
            if (ddFilter == "Position")
            {
                wc = wc + " And ( e.Name like @Filter2 ) ";
            }
            if (ddFilter == "UserId")
            {
                wc = wc + " And a.employeecode = @Filter2 ";
            }
            //if (Status != "")
            //{
            //    wc2 = wc2 + " And f.Status in (@Filter3) ";
            //    dp.Add("@Filter3",  Status);
            //}
            if (Status != "")
            {
                Status = "'" + Status.Replace(",", "','") + "'";
                wc2 = wc2 + " And a.statusId in (" + Status + ") ";
            }

            //end
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " asc ";
            }
            else
            {
                sort = " order by CompleteName asc ";
            }
            dp.Add("@Filter", "%" + filter + "%");
            dp.Add("@Filter2", "%" + TxtFilter + "%");
            //dp.Add("@Filter2", FullNameFilter);
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("Select * from AppEmployee " + wc + sort, dp);
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code " + wc + wc2 + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>("select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code" + wc + wc2 + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetAgentAccount(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');

            string managerFilter = "";
            string aeFilter = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    managerFilter = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    aeFilter = tokens[1].ToString();
                }
            }

            var dp = new DynamicParameters();

            string wc = " Where a.isdeleted = '0' and a.SectorsId = 1 and isagent = 1 and PositionId not in ('35','3','47','40','28','26','1','33','49','41','44','75')", qp = "";

            //if (managerFilter != "" && managerFilter != "null")
            //{
            //    wc = wc + " And a.UserId = @Filter3 ";
            //    dp.Add("@Filter", "%" + filter + "%");
            //}
            //if (aeFilter != "" && aeFilter != "null")
            //{
            //    wc = wc + " And a.UserId = @Filter3 ";
            //    dp.Add("@Filter", "%" + filter + "%");
            //}

            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " asc ";
            }
            else
            {
                sort = " order by CompleteName asc ";
            }

            if (managerFilter != "" && managerFilter != "null" && managerFilter != "-1")
            {
                if (!_permissionChecker.IsGranted("CRM.Leads.AllAccounts"))
                {
                    if (_permissionChecker.IsGranted("CRM.Leads.AccountExecutive"))
                    {
                        qp = "WITH CTE AS (SELECT 1 AS relationLevel, child.* FROM dbo.AppEmployee child WHERE child.ManagerId = @mempid " +
                         "UNION ALL " +
                         "SELECT relationLevel + 1, parent.* FROM CTE nextOne INNER JOIN  dbo.AppEmployee parent ON parent.ManagerId = nextOne.Id) ";
                        wc = wc + " AND a.id in (Select Id FROM (SELECT * FROM CTE union select 0, * from AppEmployee where id=@empid) AS emp) ";

                        //wc = wc + " And r.id = @empid ";
                        dp.Add("@empid", Convert.ToInt32(managerFilter));
                        dp.Add("@mempid", Convert.ToInt32(managerFilter));
                        //wc = wc + " And e.Id  = @empid ";
                        //dp.Add("@empid", accountexecutive);
                    }
                }
            }

            try
            {
                if (!forexport)
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>(qp + "select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id  Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code and f.TransactionCode = '108'  " + wc + sort, dp); //+ " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>(qp + "select count(*) Over() AS TotalRows, a.*,a.FirstName+' '+ a.MiddleName+' '+ a.LastName as CompleteName,b.Name as Dept,c.Name as Div,d.Name as Sect,e.Name as Post,f.Status from appemployee as a with (nolock) Left outer join AppDepartment as b on a.DepartmentId = b.Id  Left outer join AppDivEmployee as c on a.DivisionId = c.Id Left outer join AppSectors as d on a.sectorsid = d.Id Left outer join AppPosition as e on a.PositionID = e.Id Left outer join AppStatusTypes as f on a.StatusId = f.code and f.TransactionCode = '108' " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetEmployeeMasterList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');
            string from = "";
            string to = "";
            string employeecode = "";
            string name = "";
            string company = "";
            string position = "";
            string status = "";
            string department = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null" && tokens[1].ToString() != "null")
                {
                    from = tokens[0].ToString();
                    to = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    employeecode = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    name = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    company = tokens[4].ToString();
                }
            }
            if (tokens.Length > 5)
            {
                if (tokens[5].ToString() != "null")
                {
                    position = tokens[5].ToString();
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    status = tokens[6].ToString();
                }
            }
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    department = tokens[7].ToString();
                }
            }
            //End//

            string wc = " Where a.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (from != "" && to != "")
            {
                wc = wc + " And a.HireDate between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(from).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(to).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (employeecode != "")
            {
                wc = wc + " And a.EmployeeCode like @employeecode ";
                dp.Add("@employeecode", "%" + employeecode + "%");
            }
            if (name != "" )
            {
                wc = wc + " And a.LastName like @name and a.FirstName like @name ";
                dp.Add("@name", name);
            }
            if (company != "")
            {
                wc = wc + " And a.Sectorsid = @company ";
                dp.Add("@company", company);
            }
            if (position != "")
            {
                wc = wc + " And a.Positionid = @position ";
                dp.Add("@position", position);
            }
            if (status != "")
            {
                wc = wc + " And a.StatusId = @status ";
                dp.Add("@status", status);
            }
            if (department != "")
            {
                wc = wc + " And a.departmentid = @department ";
                dp.Add("@department", department);
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " asc ";
            }
            else
            {
                sort = " order by a.LastName asc ";
            }

            try
            {
                if (!forexport)
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>(" select count(*) Over() AS TotalRows, a.Sectorsid,a.departmentid,a.Positionid,a.EmployeeCode,a.LastName +', '+ a.FirstName as Name,a.Gender,a.EmptypeId,a.CivilStatus,a.BirthDate,a.SSS,a.PhilHealthNo,a.PagIbigNo,a.TIN,a.BankNo,a.HireDate,a.StatusId,DATEDIFF(YEAR,a.HireDate,getdate()) as ManagerId,b.Name as Sect,c.Name as Post,d.Name as Dept,a.DateResigned,DateTerminated from AppEmployee as a inner join AppSectors as b on a.SectorsId = b.Id inner join AppDepartment as c on a.DepartmentId = c.Id inner join AppPosition as d on a.PositionId = d.Id " + wc + sort, dp); //+ " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>(" select count(*) Over() AS TotalRows, a.Sectorsid,a.departmentid,a.Positionid,a.EmployeeCode,a.LastName +', '+ a.FirstName as Name,a.Gender,a.EmptypeId,a.CivilStatus,a.BirthDate,a.SSS,a.PhilHealthNo,a.PagIbigNo,a.TIN,a.BankNo,a.HireDate,a.StatusId,DATEDIFF(YEAR,a.HireDate,getdate()) as ManagerId,b.Name as Sect,c.Name as Post,d.Name as Dept,a.DateResigned,DateTerminated from AppEmployee as a inner join AppSectors as b on a.SectorsId = b.Id inner join AppDepartment as c on a.DepartmentId = c.Id inner join AppPosition as d on a.PositionId = d.Id " + wc + sort, dp); //+ " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Employee>> GetRateMasterList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //start//
            string[] tokens = filter.Split('|');
            string from = "";
            string to = "";
            string employeecode = "";
            string name = "";
            string company = "";
            string position = "";
            string status = "";
            string department = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null" && tokens[1].ToString() != "null")
                {
                    from = tokens[0].ToString();
                    to = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    employeecode = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    name = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    company = tokens[4].ToString();
                }
            }
            if (tokens.Length > 5)
            {
                if (tokens[5].ToString() != "null")
                {
                    position = tokens[5].ToString();
                }
            }
            if (tokens.Length > 6)
            {
                if (tokens[6].ToString() != "null")
                {
                    status = tokens[6].ToString();
                }
            }
            if (tokens.Length > 7)
            {
                if (tokens[7].ToString() != "null")
                {
                    department = tokens[7].ToString();
                }
            }
            //End//

            string wc = " Where a.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (from != "" && to != "")
            {
                wc = wc + " And a.HireDate between @StartDate and @EndDate ";
                dp.Add("@StartDate", Convert.ToDateTime(from).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(to).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (employeecode != "")
            {
                wc = wc + " And a.EmployeeCode like @employeecode ";
                dp.Add("@employeecode", "%" + employeecode + "%");
            }
            if (name != "")
            {
                wc = wc + " And a.LastName like @name and a.FirstName like @name ";
                dp.Add("@name", name);
            }
            if (company != "")
            {
                wc = wc + " And a.Sectorsid = @company ";
                dp.Add("@company", company);
            }
            if (position != "")
            {
                wc = wc + " And a.Positionid = @position ";
                dp.Add("@position", position);
            }
            if (status != "")
            {
                wc = wc + " And a.StatusId = @status ";
                dp.Add("@status", status);
            }
            if (department != "")
            {
                wc = wc + " And a.departmentid = @department ";
                dp.Add("@department", department);
            }

            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " asc ";
            }
            else
            {
                sort = " order by a.LastName asc ";
            }

            try
            {
                if (!forexport)
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>(" select count(*) Over() AS TotalRows,a.Id,e.EmpId, a.Sectorsid,a.departmentid,a.Positionid,a.EmployeeCode,a.LastName +', '+ a.FirstName as Name,a.Gender,a.EmptypeId,a.CivilStatus,a.BirthDate,a.SSS,a.PhilHealthNo,a.PagIbigNo,a.TIN,a.BankNo,a.HireDate,a.StatusId,DATEDIFF(YEAR,a.HireDate,getdate()) as ManagerId,b.Name as Sect,c.Name as Post,d.Name as Dept,a.DateResigned,a.DateTerminated, "
                    + " f.Status as D1Status, e.PayrollRatePerMonth as D1Name, e.PayrollRatePerDay as D1Address, e.PayrollRatePerHour as D2Name, e.Laterate as D2Address, g.Amount as D2Status "
                    + " from AppEmployee as a "
                    + " inner join AppSectors as b on a.SectorsId = b.Id "
                    + " inner join AppDepartment as c on a.DepartmentId = c.Id "
                    + " inner join AppPosition as d on a.PositionId = d.Id "
                    + " left outer join(select * from appEmpSalaries where IsDeleted = 0) as e on a.id = e.EmpId "
                    + " left outer join AppHRStatusTypes as f on e.SalaryPeriod = f.Id "
                    + " left outer join(select * from appEmployeeAllowances where IsDeleted = 0 and status = 'Active') as g on a.id = g.EmpId " + wc + sort, dp); //+ " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Employee> getAll = await _repositoryEmployeeDapper.QueryAsync<Employee>(" select count(*) Over() AS TotalRows,a.Id,e.EmpId, a.Sectorsid,a.departmentid,a.Positionid,a.EmployeeCode,a.LastName +', '+ a.FirstName as Name,a.Gender,a.EmptypeId,a.CivilStatus,a.BirthDate,a.SSS,a.PhilHealthNo,a.PagIbigNo,a.TIN,a.BankNo,a.HireDate,a.StatusId,DATEDIFF(YEAR,a.HireDate,getdate()) as ManagerId,b.Name as Sect,c.Name as Post,d.Name as Dept,a.DateResigned,a.DateTerminated, "
                    + " f.Status as D1Status, e.PayrollRatePerMonth as D1Name, e.PayrollRatePerDay as D1Address, e.PayrollRatePerHour as D2Name, e.Laterate as D2Address, g.Amount as D2Status "
                    + " from AppEmployee as a "
                    + " inner join AppSectors as b on a.SectorsId = b.Id "
                    + " inner join AppDepartment as c on a.DepartmentId = c.Id "
                    + " inner join AppPosition as d on a.PositionId = d.Id "
                    + " left outer join(select * from appEmpSalaries where IsDeleted = 0) as e on a.id = e.EmpId "
                    + " left outer join AppHRStatusTypes as f on e.SalaryPeriod = f.Id "
                    + " left outer join(select * from appEmployeeAllowances where IsDeleted = 0 and status = 'Active') as g on a.id = g.EmpId " + wc + sort, dp); //+ " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
