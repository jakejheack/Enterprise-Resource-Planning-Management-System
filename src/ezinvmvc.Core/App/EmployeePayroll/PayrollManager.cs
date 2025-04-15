using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeePayroll.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeePayroll
{
    public class PayrollManager : DomainService, IPayrollManager
    {
        private readonly IRepository<Payroll> _repository;
        private readonly IDapperRepository<Payroll> _repositoryDapper;

        public PayrollManager(IRepository<Payroll> repository, IDapperRepository<Payroll> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Payroll entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
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

        public async Task<Payroll> GetbyIdAsync(int id)
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

        public async Task<IEnumerable<Payroll>> GetListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');

            string datestart = "";
            string dateend = "";
            string empid = "";
            string attId = "";
            string compname = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null" && tokens[1].ToString() != "null")
                {
                    datestart = tokens[0].ToString();
                    dateend = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    empid = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    attId = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    compname = tokens[4].ToString();
                }
            }
            string wc2 = "";
            string wc = " Where a.isdeleted = 0 and b.isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (datestart != "" && dateend != "")
            {
                wc = wc + " And b.creationtime between @StartDate and @EndDate ";
                dp.Add("@StartDate", datestart);
                dp.Add("@EndDate", dateend);
            }
            if (empid != "0")
            {
                wc = wc + " And b.id = @Id ";
                dp.Add("@Id", empid);
            }
            if (attId != "")
            {
                wc = wc + " And a.attId = @attId ";
                wc2 = " where AttendanceId = @attId ";
                dp.Add("@attId", attId);
            }
            if (compname != "")
            {
                wc = wc + " And a.description1 = @compname ";
                dp.Add("@compname", compname);
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
                sort = "order by a.creationtime desc";
            }

            try
            {
                if (!forexport)
                {
                    var getAll = await _repositoryDapper.QueryAsync<Payroll>("select count(*) Over() AS TotalRows, a.*, b.LastName,b.FirstName,b.MiddleName, CAST(c.DateRecorded AS VARCHAR) as Status1,CAST(c.startdate AS VARCHAR) as Status2,CAST(c.EndDate AS VARCHAR) as Status3,b.EmployeeCode as EmpCode from apppayroll as a inner join appemployee as b on a.empid = b.id inner join (select  DISTINCT  StartDate, EndDate,DateRecorded,attendanceid from appAttendance2 " + wc2 + " group by  StartDate, EndDate,DateRecorded,attendanceid) as c on a.AttId = c.attendanceid" + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    var getAll = await _repositoryDapper.QueryAsync<Payroll>(" " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Payroll entity)
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

        public async Task<IEnumerable<Payroll>> GetbyIdDetailsAsync(int id)
        {
            string wc = " Where a.isdeleted = 0 and a.id = @id";
            string sort = " order by a.Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Payroll>("select a.*,b.FirstName,b.MiddleName,b.LastName,c.Name as Department,d.Status as PayrollPeriod,e.Status as PayrollSalaryPeriod from AppPayroll as a left outer join AppEmployee as b on a.EmpId =b.Id left outer join AppDepartment as c on b.DepartmentId =b.Id left outer join AppHRStatusTypes as d on a.Periodid =d.Id left outer join AppHRStatusTypes as e on a.SalaryPeriod =e.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Payroll> GetAttIdDataAsync(string AttId)
        {
            string wc = "  Where a.isdeleted = 0 a.attid = @AttId ";
            string sort = "";
            var dp = new DynamicParameters();
            dp.Add("@AttId", AttId);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Payroll>(" select  top 1 b.StartDate, b.EndDate, a.Description1 from AppPayroll as a inner join appAttendance2 as b on a.AttId = b.AttendanceId " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }



        public async Task<IEnumerable<Payroll>> GetAttendanceRecordAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string dept = "";
            string Attid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[1].ToString() != "null")
                {
                    dateto = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    Attid = tokens[3].ToString();
                }
            }

            string wc = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where ab.DateT between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " and ab.DateT between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where ab.Companyname like  @dept";
                }
                else
                {
                    wc = wc + " and ab.Companyname like  @dept ";
                }
                dp.Add("@dept", "%" + dept + "%");
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where ab.AttendanceId like @Attid";
                }
                else
                {
                    wc = wc + " and ab.AttendanceId like @Attid ";
                }
                dp.Add("@Attid", "%" + Attid + "%");
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
                sort = " order by ab.DateT desc ";
            }

            try
            {
                IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select count(*) Over() AS TotalRows, * from (select distinct  CAST(startDate AS DATE) as DateT,a.AttendanceId,Department from AppAttendance2 as a inner join AppCompany as b on a.Company = b.Id) as ab " + wc + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }


        public async Task<IEnumerable<Payroll>> GetPRSummaryListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string dept2 = "";
            string Attid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dateto = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept2 = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    Attid = tokens[3].ToString();
                }
            }

            string wc = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and c.DateRecorded between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " where c.DateRecorded between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept2 != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and c.Department = @dept2 ";
                }
                else
                {
                    wc = wc + " where c.Department = @dept2 ";
                }
                dp.Add("@dept2", dept2);
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where a.attid = @Attid";
                }
                else
                {
                    wc = wc + " and a.attid = @Attid ";
                }
                dp.Add("@Attid", Attid);
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
                sort = " order by c.DateRecorded desc ";
            }

            try
            {
                //IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select count(*) Over() AS TotalRows, b.Id as EmpId,c.DateRecorded as Description1,a.attid,c.Department,b.EmployeeCode as Description3,b.LastName +' '+ b.FirstName +' '+ b. MiddleName as FirstName,b.BankNo as Description2,a.NetIncome,a.SSSEEAmount,a.SSSECAmount,a.PhilhealthEEAmount,a.PagibigEEAmount from AppPayroll as a inner join Appemployee as b on a.Empid = b.id inner join (select distinct no,Department,attendanceid,DateRecorded from AppAttendance2) as c on b.EmployeeCode = c.No and c.attendanceid = a.AttId " + wc + sort, dp);
                //return getAll;


                if (!forexport)
                {
                    IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select count(*) Over() AS TotalRows, b.Id as EmpId,c.DateRecorded as Description1,a.attid,c.Department,b.EmployeeCode as Description3,b.LastName +' '+ b.FirstName +' '+ b. MiddleName as FirstName,b.BankNo as Description2,a.NetIncome,a.SSSEEAmount,a.SSSECAmount,a.PhilhealthEEAmount,a.PagibigEEAmount from AppPayroll as a inner join Appemployee as b on a.Empid = b.id inner join (select distinct no,Department,attendanceid,DateRecorded from AppAttendance2) as c on b.EmployeeCode = c.No and c.attendanceid = a.AttId " + wc + sort, dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select count(*) Over() AS TotalRows, b.Id as EmpId,c.DateRecorded as Description1,a.attid,c.Department,b.EmployeeCode as Description3,b.LastName +' '+ b.FirstName +' '+ b. MiddleName as FirstName,b.BankNo as Description2,a.NetIncome,a.SSSEEAmount,a.SSSECAmount,a.PhilhealthEEAmount,a.PagibigEEAmount from AppPayroll as a inner join Appemployee as b on a.Empid = b.id inner join (select distinct no,Department,attendanceid,DateRecorded from AppAttendance2) as c on b.EmployeeCode = c.No and c.attendanceid = a.AttId " + wc + sort, dp);
                    return getAll;
                }

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }


        public async Task<IEnumerable<Payroll>> GetSSSSummaryListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string dept = "";
            string Attid = "";
            string empid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dateto = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    Attid = tokens[3].ToString();
                }
            }

            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    empid = tokens[4].ToString();
                }
            }
            string wc = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and c.DateRecorded between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " where c.DateRecorded between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and c.Department = @dept2 ";
                }
                else
                {
                    wc = wc + " where c.Department = @dept2 ";
                }
                dp.Add("@dept2", dept);
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where a.attid = @Attid";
                }
                else
                {
                    wc = wc + " and a.attid = @Attid ";
                }
                dp.Add("@Attid", Attid);
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
                sort = " order by c.DateRecorded desc ";
            }

            try
            {
                IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select a.*,b.LastName +' '+ b.FirstName +' '+ b. MiddleName as FirstName,b.employeecode as EmpCode,b.sss as MiddleName,e.Name as Department,DateRecorded as PayrollPeriod,a.SSSEEamount + a.SSSERAmount + a.SSSECAmount as PayrollSalaryPeriod from AppPayroll as a inner join appemployee as b on a.Empid = b.id inner join (select distinct no,Department,attendanceid,DateRecorded from AppAttendance2) as c on b.EmployeeCode = c.No and c.attendanceid = a.AttId inner join AppDepartment as e on b.DepartmentId = e.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Payroll>> GetPhltSummaryListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string dept = "";
            string Attid = "";
            string empid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dateto = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    Attid = tokens[3].ToString();
                }
            }

            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    empid = tokens[4].ToString();
                }
            }
            string wc = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and c.DateRecorded between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " where c.DateRecorded between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and c.Department = @dept2 ";
                }
                else
                {
                    wc = wc + " where c.Department = @dept2 ";
                }
                dp.Add("@dept2", dept);
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where a.attid = @Attid";
                }
                else
                {
                    wc = wc + " and a.attid = @Attid ";
                }
                dp.Add("@Attid", Attid);
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
                sort = " order by d.Name desc ";
            }

            try
            {
                IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select a.*,b.LastName +' '+ b.FirstName +' '+ b. MiddleName as FirstName,b.employeecode as EmpCode,b.PhilHealthNo as MiddleName,Department,DateRecorded as PayrollPeriod,d.Name as Department from AppPayroll as a inner join appemployee as b on a.Empid = b.id inner join (select distinct no,Department,attendanceid,DateRecorded from AppAttendance2) as c on b.EmployeeCode = c.No and c.attendanceid = a.AttId inner join AppDepartment as d on b.DepartmentId = d.id" + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Payroll>> GetPgbtSummaryListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string dept = "";
            string Attid = "";
            string empid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dateto = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    Attid = tokens[3].ToString();
                }
            }

            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    empid = tokens[4].ToString();
                }
            }
            string wc = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and c.DateRecorded between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " where c.DateRecorded between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and c.Department = @dept2 ";
                }
                else
                {
                    wc = wc + " where c.Department = @dept2 ";
                }
                dp.Add("@dept2", dept);
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where a.attid = @Attid";
                }
                else
                {
                    wc = wc + " and a.attid = @Attid ";
                }
                dp.Add("@Attid", Attid);
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
                sort = " order by c.DateRecorded desc ";
            }

            try
            {
                IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select a.*,b.LastName +' '+ b.FirstName +' '+ b. MiddleName as FirstName,b.employeecode as EmpCode,b.PagIbigNo as MiddleName,Department,DateRecorded as PayrollPeriod from AppPayroll as a inner join appemployee as b on a.Empid = b.id inner join (select distinct no,Department,attendanceid,DateRecorded from AppAttendance2) as c on b.EmployeeCode = c.No and c.attendanceid = a.AttId " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Payroll>> GetAttAdjSummaryListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string dept = "";
            string Attid = "";
            string empid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dateto = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    Attid = tokens[3].ToString();
                }
            }

            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    empid = tokens[4].ToString();
                }
            }
            string wc = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and a.CreationTime between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " where a.CreationTime between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and b.Department = @dept2 ";
                }
                else
                {
                    wc = wc + " where b.Department = @dept2 ";
                }
                dp.Add("@dept2", dept);
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where a.attid = @Attid";
                }
                else
                {
                    wc = wc + " and a.attid = @Attid ";
                }
                dp.Add("@Attid", Attid);
            }
            if (empid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where a.empid = @empid";
                }
                else
                {
                    wc = wc + " and a.empid = @empid ";
                }
                dp.Add("@empid", empid);
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
                sort = " order by a.CreationTime desc ";
            }

            try
            {
                IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select count(*) Over() AS TotalRows, a.*,b.EmployeeCode as LastName,b.Name as FirstName,b.Department as Department,b.Days as middlename,b.absent as PayrollPeriod,b.late as PayrollSalaryPeriod, b.Undertime as EmpCode  from appPayroll as a inner join ( "
                                        + "select timesum.EmpId, timesum.AttId, timesum.Name, timesum.Department,timesum.EmployeeCode, isnull(sum(CAST(timesum.Days AS DECIMAL(10, 2))), '0') as Days, isnull(sum(CAST(timesum.absent AS DECIMAL(10, 2))), '0') as absent, isnull(cast(sum(datediff(second, 0, timesum.late)) / 3600 as varchar(12)) + ':' + right('0' + cast(sum(datediff(second, 0, timesum.late)) / 60 % 60 as varchar(2)), 2) + ':' + right('0' + cast(sum(datediff(second, 0, timesum.late)) % 60 as varchar(2)), 2), '0:00') as late, "
                                        + "isnull(cast(sum(datediff(second, 0, timesum.Undertime)) / 3600 as varchar(12)) + ':' + right('0' + cast(sum(datediff(second, 0, timesum.Undertime)) / 60 % 60 as varchar(2)), 2) + ':' + right('0' + cast(sum(datediff(second, 0, timesum.Undertime)) % 60 as varchar(2)), 2), '0:00') as Undertime "
                                        + "from(select t1.EmpId, t1.AttId, t1.Name, t1.Department,t1.employeeCode, t2.Description2 as Days, t3.Description2 as absent, t4.Description2 as Late, t5.Description2 as Undertime from( "
                                        + "select a.*, e.LastName + ' ' + e.FirstName + ' ' + e.MiddleName as Name, d.Department,e.employeeCode from AppPayrollAttAdjustment as a  left outer join appemployee as e on a.empid = e.id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = e.EmployeeCode and d.attendanceid = a.attid where AdjType in ('9', '2', '3', '4')) as t1 "
                                        + "left join(select a.*, e.LastName + ' ' + e.FirstName + ' ' + e.MiddleName as Name, d.Department,e.employeeCode from AppPayrollAttAdjustment as a  left outer join appemployee as e on a.empid = e.id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = e.EmployeeCode and d.attendanceid = a.attid) as t2 on t1.AdjType = T2.AdjType  and T2.AdjType = '9' "
                                        + "left join(select a.*, e.LastName + ' ' + e.FirstName + ' ' + e.MiddleName as Name, d.Department,e.employeeCode from AppPayrollAttAdjustment as a  left outer join appemployee as e on a.empid = e.id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = e.EmployeeCode and d.attendanceid = a.attid) as t3 on t1.AdjType = T3.AdjType and T3.AdjType = '2' "
                                        + "left join(select a.*, e.LastName + ' ' + e.FirstName + ' ' + e.MiddleName as Name, d.Department,e.employeeCode from AppPayrollAttAdjustment as a  left outer join appemployee as e on a.empid = e.id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = e.EmployeeCode and d.attendanceid = a.attid) as t4 on t1.AdjType = T4.AdjType  and T4.AdjType = '3' "
                                        + "left join(select a.*, e.LastName + ' ' + e.FirstName + ' ' + e.MiddleName as Name, d.Department,e.employeeCode from AppPayrollAttAdjustment as a  left outer join appemployee as e on a.empid = e.id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = e.EmployeeCode and d.attendanceid = a.attid) as t5 on t1.AdjType = T5.AdjType  and T5.AdjType = '4' "
                                        + "group by t1.EmpId, t1.AttId, t1.Name, t1.Department,t1.employeeCode, t2.Description2, t3.Description2, t4.Description2, t5.Description2) as timesum group by timesum.EmpId, timesum.AttId, timesum.Name, timesum.Department,timesum.EmployeeCode) as b on a.EmpId = b.EmpId and a.AttId = b.AttId " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }


        public async Task<IEnumerable<Payroll>> GetPayrollDetailsListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string dept = "";
            string Attid = "";
            string empid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    dateto = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    Attid = tokens[3].ToString();
                }
            }

            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    empid = tokens[4].ToString();
                }
            }
            string wc = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and pr.CreationTime between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " where pr.CreationTime between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and pr.description1 like @dept2 ";
                }
                else
                {
                    wc = wc + " where pr.description1 like @dept2 ";
                }
                dp.Add("@dept2", "%" + dept + "%");
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where pr.attid = @Attid";
                }
                else
                {
                    wc = wc + " and pr.attid = @Attid ";
                }
                dp.Add("@Attid", Attid);
            }
            if (empid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where pr.empid = @empid";
                }
                else
                {
                    wc = wc + " and pr.empid = @empid ";
                }
                dp.Add("@empid", empid);
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
                sort = " order by DP.Name desc ";
            }

            try
            {
                IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select count(*) Over() AS TotalRows, pr.*,em.EmployeeCode as EmpCode,em.LastName + ' ' + em.FirstName + ' ' + em.MiddleName as LastName,DP.Name As Department,SL.PayrollRatePermonth as PayrollSalaryPeriod," +
                        " PR.AbsensesAmount + PR.TardinessAmount + PR.UndertimeAmount as PayrollPeriod, PR.BasicSalaryAmount - PR.AbsensesAmount + PR.TardinessAmount + PR.UndertimeAmount as FirstName" +
                        " from AppPayroll as PR" +
                        " inner join appEmployee as EM on pr.EmpId = EM.id" +
                        " inner join AppDepartment as DP on DP.Id = EM.DepartmentId" +
                        " inner join appEmpSalaries as SL on SL.EmpId = EM.id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Payroll>> GetLeaveCountListAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string empid = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    empid = tokens[1].ToString();
                }
            }
            string wc = " where isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (datefrom != "" && datefrom != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where YEAR (CreationTime) = YEAR (@StartDate) ";
                }
                else
                {
                    wc = wc + " and YEAR (CreationTime) = YEAR (@StartDate) ";
                }
                dp.Add("@StartDate", datefrom);
            }
            if (empid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + "where empid = @empid";
                }
                else
                {
                    wc = wc + " and empid = @empid ";
                }
                dp.Add("@empid", empid);
            }         
            try
            {
                IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" SELECT sum (LeaveUse) as LeaveUse FROM AppPayroll " + wc , dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }


        public async Task<IEnumerable<Payroll>> GetPayrollJournalDetailAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string attid = "";
            string comp = "";
            string name = "";
            string empid = "";
            string card = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    attid = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    comp = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    name = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    empid = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    card = tokens[4].ToString();
                }
            }
            string wc = " where a.isdeleted = 0 and b.isdeleted = 0 ";
            var dp = new DynamicParameters();
            
            if (attid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where a.AttId = @attid";
                }
                else
                {
                    wc = wc + " and a.AttId = @attid ";
                }
                dp.Add("@attid", attid);
            }
            if (comp != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where a.Description1 like @comp";
                }
                else
                {
                    wc = wc + " and a.Description1 like @comp ";
                }
                dp.Add("@comp", "%" + comp + "%");
            }
            if (name != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where Description2 like @name";
                }
                else
                {
                    wc = wc + " and Description2 like @name ";
                }
                dp.Add("@name", "%" + name + "%");
            }
            if (empid != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where a.EmpId = @empid";
                }
                else
                {
                    wc = wc + " where a.EmpId @empid ";
                }
                dp.Add("@empid", empid);
            }
            if (card != "")
            {
                if (card == "1")
                {
                    if (string.IsNullOrEmpty(wc))
                    {
                        wc = wc + " where b.BankNo > @card ";
                    }
                    else
                    {
                        wc = wc + " and b.BankNo > @card ";
                    }
                    dp.Add("@card", "");
                }
                if (card == "2")
                {
                    if (string.IsNullOrEmpty(wc))
                    {
                        wc = wc + " where b.BankNo = @card ";
                    }
                    else
                    {
                        wc = wc + " and b.BankNo = @card ";
                    }
                    dp.Add("@card", "");
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
                sort = "order by d.name asc";
            }
            try
            {
                IEnumerable<Payroll> getAll = await _repositoryDapper.QueryAsync<Payroll>(" select count(*) Over() AS TotalRows,a.AttId ,a.Description1,a.EmpId,b.EmployeeCode as EmpCode,b.LastName +','+ b.FirstName as Description2, b.Bank as FirstName, b.BankNo as LastName, a.NetIncome, c.name as Description3,d.name as Department from AppPayroll as a inner join AppEmployee as b on a.EmpId = b.id inner join AppDivEmployee as c on b.DivisionId = c.id inner join AppDepartment as d on b.DepartmentId = d.id" + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
