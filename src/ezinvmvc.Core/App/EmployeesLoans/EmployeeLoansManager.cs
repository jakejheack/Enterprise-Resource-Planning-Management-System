using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.EmployeesLoans.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeesLoans
{
    public class EmployeeLoansManager : DomainService, IEmployeeLoansManager
    {
        private readonly IRepository<EmployeeLoans> _repositoryEmployeeLoans;
        private readonly IDapperRepository<EmployeeLoans> _repositoryEmployeeLoanssDapper;

        public EmployeeLoansManager(IRepository<EmployeeLoans> repository, IDapperRepository<EmployeeLoans> repositoryDapper)
        {
            _repositoryEmployeeLoans = repository;
            _repositoryEmployeeLoanssDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateEmployeeLoansAsync(EmployeeLoans entity)
        {
            var result = _repositoryEmployeeLoans.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryEmployeeLoans.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> DeleteEmployeeLoansAsync(int id)
        {
            var result = _repositoryEmployeeLoans.FirstOrDefault(x => x.Id == id);
            if (result != null)
            {
                await _repositoryEmployeeLoans.DeleteAsync(result);
                return IdentityResult.Success;
            }
            else
            {
                throw new UserFriendlyException("No Data Found!");
            }
        }

        public async Task<IdentityResult> UpdateEmployeeLoansAsync(EmployeeLoans entity)
        {
            try
            {
                await _repositoryEmployeeLoans.UpdateAsync(entity);
                return IdentityResult.Success;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error Updating: " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetAllEmployeeLoansAsync(string filter)
        {
            string wc = " Where (a.EmpId = @empId) ";
            //string wc = " Where a.IsDeleted = 0 And (a.EmpId = @empId) and a.status = 'Active'";
            string sort = " order by a.Status,a.Id desc";
            var dp = new DynamicParameters();
            dp.Add("@empId", filter);
            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>("select a.*,b.FirstName+ ' ' +b.MiddleName +' '+ b.LastName as FullName,b.EmployeeCode,c.LoanTitleName,d.LoanTypeName from AppEmployeeLoans as a with (nolock) inner join AppEmployee as b with (nolock) on a.EmpId = b.Id inner join appLoanTitle as c with(nolock) on a.LoanTitle = c.Id inner join appLoanType as d with(nolock) on a.LoanType = d.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmployeeDetailAsync(int empId)
        {
            string wc = " Where IsDeleted = 0 And (Id = @empId) and statusId = 1";
            string sort = " order by Id desc";
            var dp = new DynamicParameters();
            dp.Add("@empId", empId);
            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>("select * from AppEmployee " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }

        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmployeeLoansIdAsync(int Id)
        {
            string wc = " Where a.IsDeleted = 0 And (a.Id = @Id) and a.status = 'Active'";
            string sort = " order by a.Id desc";
            var dp = new DynamicParameters();
            dp.Add("@Id", Id);
            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>("select a.*,b.FirstName,b.MiddleName,b.LastName,b.Address from AppEmployeeLoans as a with (nolock) inner join AppEmployee as b with (nolock) on a.EmpId = b.Id " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetLoanListAsync(string filter, string sorting)
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
                    wc = wc + " and d.DateRecorded between @StartDate and @EndDate ";
                }
                else
                {
                    wc = wc + " where d.DateRecorded between @StartDate and @EndDate ";
                }
                dp.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and ln.Department = @dept2 ";
                }
                else
                {
                    wc = wc + " where ln.Department = @dept2 ";
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
                sort = " order by b.LoanTitleName asc ";
            }

            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select a.*,g.employeecode as fullName,g.LastName + ' ' + g.FirstName + ' ' + g.MiddleName as Name,b.LoanTitleName,c.LoanTypeName,h.Status as FirstName,ln.Department as MiddleName,ln.Amount as LastName,a.LoanAmount - ln.Amount as Address from appEmployeeLoans as a inner join appLoanTitle as b on a.LoanTitle = b.Id inner join appLoanType as c on a.loanType = c.Id " +
                        " left outer join AppEmployee as g on a.empid = g.id left outer join AppHRStatusTypes as h on a.DeductionType = h.id left outer join (select sum(amount) as Amount, Empid, Appno, dp.Department from AppPayrollSSSLoan as Ap inner join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as Dp on ap.Empid = Dp.no group by Empid, Appno, dp.Department " +
                        " union select sum(amount) as Amount, Empid, Appno, dp2.Department from AppPayrollPagibigLoan as Ap2 inner join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as Dp2 on ap2.Empid = Dp2.no group by Empid, Appno, dp2.Department " +
                        " union select sum(amount) as Amount, Empid, Appno, dp3.Department from AppPayrollOtherLoan as Ap3 inner join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as Dp3 on ap3.Empid = Dp3.no group by Empid, Appno, dp3.Department) as Ln on a.ApplicationNo = ln.AppNo " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> ForceclosedloanAsync(int Id)
        {
            string wc = " Where Id = @Id";
            string sort = "";
            var dp = new DynamicParameters();
            dp.Add("@Id", Id);
            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>("update appEmployeeLoans set status = 'Closed' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmpLoanListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');
            string company = "";
            string name = "";
            string dept = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    company = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    name = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }

            string wc = " ";
            var dp = new DynamicParameters();

            if (company != "" && company != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and rec.company like @company ";
                }
                else
                {
                    wc = wc + " where rec.company like @company ";
                }
                dp.Add("@company", '%'+ company +'%');
            }
            if (name != "" && name != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and rec.FullName like @name ";
                }
                else
                {
                    wc = wc + " where rec.FullName like @name ";
                }
                dp.Add("@name", '%' + name + '%');
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and rec.Dept like @dept ";
                }
                else
                {
                    wc = wc + " where rec.Dept like @dept ";
                }
                dp.Add("@dept", '%' + dept + '%');
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
                sort = " order by LoanRec.FullName asc ";
            }

            try
            {
                if (!forexport)
                {
                    IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select count(*) Over() AS TotalRows, * from(select distinct  Rec.Empid,Rec.Company as Name,Rec.Employeecode as TIN,Rec.Fullname,Rec.Dept as FirstName from ( "
                                                    + " select a.empId, c.Name as Company, b.EmployeeCode, b.FirstName + ' ' + b.MiddleName + ' ' + b.LastName as FullName, d.Name as Dept from appEmployeeLoans as a "
                                                    + " left outer join Appemployee as b on a.empid = b.id left outer join AppSectors as c on b.SectorsId = c.id left outer join AppDepartment as d on b.DepartmentId = d.id where a.IsDeleted = 0 and a.Status = 'Active') as Rec " + wc + ")"
                                                    + " as LoanRec " + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select count(*) Over() AS TotalRows, * from(select distinct  Rec.Empid,Rec.Company as Name,Rec.Employeecode as TIN,Rec.Fullname,Rec.Dept as FirstName from ( "
                                                    + " select a.empId, c.Name as Company, b.EmployeeCode, b.FirstName + ' ' + b.MiddleName + ' ' + b.LastName as FullName, d.Name as Dept from appEmployeeLoans as a "
                                                    + " left outer join Appemployee as b on a.empid = b.id left outer join AppSectors as c on b.SectorsId = c.id left outer join AppDepartment as d on b.DepartmentId = d.id where a.IsDeleted = 0 and a.Status = 'Active') as Rec " + wc + ")"
                                                    + " as LoanRec " + sort , dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmpLoanSSSAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            
            string empId = "";
            string LoanTitle = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    empId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LoanTitle = tokens[1].ToString();
                }
            }

            string wc = " where IsDeleted = 0 and status = 'Active' ";
            var dp = new DynamicParameters();

            if (empId != "" && empId != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where EmpId = @empId ";
                }
                else
                {
                    wc = wc + " and EmpId = @empId ";
                }
                dp.Add("@empId", empId);
            }
            if (LoanTitle != "" && LoanTitle != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where LoanTitle = @LoanTitle ";
                }
                else
                {
                    wc = wc + " and LoanTitle = @LoanTitle ";
                }
                dp.Add("@LoanTitle", LoanTitle);
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
                sort = " ";
            }

            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select sum(LoanAmount) as LoanAmount,EmpId,LoanTitle from appEmployeeLoans " + wc + "  group by EmpId,LoanTitle " + sort, dp);
                return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmpLoanPgbAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');

            string empId = "";
            string LoanTitle = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    empId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LoanTitle = tokens[1].ToString();
                }
            }

            string wc = " where IsDeleted = 0 and status = 'Active' ";
            var dp = new DynamicParameters();

            if (empId != "" && empId != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where EmpId = @empId ";
                }
                else
                {
                    wc = wc + " and EmpId = @empId ";
                }
                dp.Add("@empId", empId);
            }
            if (LoanTitle != "" && LoanTitle != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where LoanTitle = @LoanTitle ";
                }
                else
                {
                    wc = wc + " and LoanTitle = @LoanTitle ";
                }
                dp.Add("@LoanTitle", LoanTitle);
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
                sort = " ";
            }

            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select sum(LoanAmount) as LoanAmount,EmpId,LoanTitle from appEmployeeLoans " + wc + "  group by EmpId,LoanTitle " + sort, dp);
                return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmpLoanPgbListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');

            string empId = "";
            string LoanTitle = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    empId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LoanTitle = tokens[1].ToString();
                }
            }

            string wc = " where a.IsDeleted = 0 and b.status = 'Active' ";
            var dp = new DynamicParameters();

            if (empId != "" && empId != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where b.EmpId = @empId ";
                }
                else
                {
                    wc = wc + " and b.EmpId = @empId ";
                }
                dp.Add("@empId", empId);
            }
            if (LoanTitle != "" && LoanTitle != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where b.LoanTitle = @LoanTitle ";
                }
                else
                {
                    wc = wc + " and b.LoanTitle = @LoanTitle ";
                }
                dp.Add("@LoanTitle", LoanTitle);
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
                sort = " ";
            }

            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select a.EmpId,c.LoanTitleName,d.LoanTypeName,a.AppNo as ApplicationNo,a.AttId as fullName,b.LoanAmount,b.DateStart,b.DateEnd,b.MonthlyAmortization,a.StartDate as DateReceived from AppPayrollPagibigLoan as a inner join appEmployeeLoans as b on a.AppNo = b.ApplicationNo "
                                                                                            + " inner join appLoanTitle as c on b.LoanTitle = c.Id inner join appLoanType as d on d.id = b.LoanType " + wc + sort, dp);
                return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmpLoanOthAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');

            string empId = "";
            string LoanTitle = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    empId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LoanTitle = tokens[1].ToString();
                }
            }

            string wc = " where IsDeleted = 0 and status = 'Active' ";
            var dp = new DynamicParameters();

            if (empId != "" && empId != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where EmpId = @empId ";
                }
                else
                {
                    wc = wc + " and EmpId = @empId ";
                }
                dp.Add("@empId", empId);
            }
            if (LoanTitle != "" && LoanTitle != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where LoanTitle = @LoanTitle ";
                }
                else
                {
                    wc = wc + " and LoanTitle = @LoanTitle ";
                }
                dp.Add("@LoanTitle", LoanTitle);
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
                sort = " ";
            }

            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select sum(LoanAmount) as LoanAmount,EmpId,LoanTitle from appEmployeeLoans " + wc + "  group by EmpId,LoanTitle " + sort, dp);
                return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmpLoanOthListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');

            string empId = "";
            string LoanTitle = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    empId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LoanTitle = tokens[1].ToString();
                }
            }

            string wc = " where a.IsDeleted = 0 and b.status = 'Active' ";
            var dp = new DynamicParameters();

            if (empId != "" && empId != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where b.EmpId = @empId ";
                }
                else
                {
                    wc = wc + " and b.EmpId = @empId ";
                }
                dp.Add("@empId", empId);
            }
            if (LoanTitle != "" && LoanTitle != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where b.LoanTitle = @LoanTitle ";
                }
                else
                {
                    wc = wc + " and b.LoanTitle = @LoanTitle ";
                }
                dp.Add("@LoanTitle", LoanTitle);
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
                sort = " ";
            }

            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select a.EmpId,c.LoanTitleName,d.LoanTypeName,a.AppNo as ApplicationNo,a.AttId as fullName,b.LoanAmount,b.DateStart,b.DateEnd,b.MonthlyAmortization,a.StartDate as DateReceived from AppPayrollOtherLoan as a inner join appEmployeeLoans as b on a.AppNo = b.ApplicationNo "
                                                                                            + " inner join appLoanTitle as c on b.LoanTitle = c.Id inner join appLoanType as d on d.id = b.LoanType " + wc + sort, dp);
                return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetLoanSummaryReportListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');
            string comp = "";
            string LoanTitleId = "";
            //string dept = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    comp = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LoanTitleId = tokens[1].ToString();
                }
            }
            //if (tokens.Length > 2)
            //{
            //    if (tokens[2].ToString() != "null")
            //    {
            //        dept = tokens[2].ToString();
            //    }
            //}

            string wc = " where a.Status = 'Active' and a.IsDeleted = 0 ";
            var dp = new DynamicParameters();

            if (comp != "" && comp != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where d.Id = @comp  ";
                }
                else
                {
                    wc = wc + " and d.Id = @comp ";
                }
                dp.Add("@comp", comp);
            }
            if (LoanTitleId != "" && LoanTitleId != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where a.LoanTitle = @LoanTitleId ";
                }
                else
                {
                    wc = wc + " and a.LoanTitle = @LoanTitleId ";
                }
                dp.Add("@LoanTitleId", LoanTitleId);
            }
            //if (dept != "" && dept != "null")
            //{
            //    if (string.IsNullOrEmpty(wc))
            //    {
            //        wc = wc + " where d.Id = @dept ";
            //    }
            //    else
            //    {
            //        wc = wc + " and d.Id = @dept ";
            //    }
            //    dp.Add("@dept", dept);
            //}
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
                sort = "  order by e.Name,fullName asc ";
            }
            try
            {
                if (!forexport)
                {
                    IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select count(*) Over() AS TotalRows,a.LoanTitle,d.Name as Name,e.Name as FirstName,a.EmpId,c.EmployeeCode as LoanType,c.LastName +', '+c.FirstName as FullName,a.ApplicationNo, b.Description as MiddleName ,a.LoanAmount,a.DateStart,a.DateEnd,a.MonthlyAmortization,b.TotalPaid as Address from appEmployeeLoans as a inner join "
                                    + "(select EmpId, Appno, Description, sum(Amount) as TotalPaid, '1' as loanTitleId from AppPayrollSSSLoan where Status = 'Active' and IsDeleted = 0 group by EmpId, Appno, Description "
                                    + "union "
                                    + "select EmpId, Appno, Description, sum(Amount) as TotalPaid, '2' as loanTitleId from AppPayrollPagibigLoan where Status = 'Active' and IsDeleted = 0 group by EmpId, Appno, Description "
                                    + "union "
                                    + "select EmpId, Appno, Description, sum(Amount) as TotalPaid, '3' as loanTitleId from AppPayrollOtherLoan where Status = 'Active' and IsDeleted = 0  group by EmpId, Appno, Description) as b "
                                    + "on a.ApplicationNo = b.AppNo and LoanTitle = loanTitleId inner join AppEmployee as c on b.EmpId = c.id inner join AppSectors as d on c.SectorsId = d.id inner join AppDepartment as e on c.DepartmentId = e.id " + wc + sort, dp);
                    return getAll;
                }
                else
                {
                    IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select count(*) Over() AS TotalRows,a.LoanTitle,d.Name as Name,e.Name as FirstName,a.EmpId,c.EmployeeCode as LoanType,c.LastName +', '+c.FirstName as FullName,a.ApplicationNo, b.Description as MiddleName ,a.LoanAmount,a.DateStart,a.DateEnd,a.MonthlyAmortization,b.TotalPaid as Address from appEmployeeLoans as a inner join "
                                    + "(select EmpId, Appno, Description, sum(Amount) as TotalPaid, '1' as loanTitleId from AppPayrollSSSLoan where Status = 'Active' and IsDeleted = 0 group by EmpId, Appno, Description "
                                    + "union "
                                    + "select EmpId, Appno, Description, sum(Amount) as TotalPaid, '2' as loanTitleId from AppPayrollPagibigLoan where Status = 'Active' and IsDeleted = 0 group by EmpId, Appno, Description "
                                    + "union "
                                    + "select EmpId, Appno, Description, sum(Amount) as TotalPaid, '3' as loanTitleId from AppPayrollOtherLoan where Status = 'Active' and IsDeleted = 0  group by EmpId, Appno, Description) as b "
                                    + "on a.ApplicationNo = b.AppNo and LoanTitle = loanTitleId inner join AppEmployee as c on b.EmpId = c.id inner join AppSectors as d on c.SectorsId = d.id inner join AppDepartment as e on c.DepartmentId = e.id " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmpLoanCertListAsync(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            string[] tokens = filter.Split('|');
            string company = "";
            string name = "";
            string dept = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    company = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    name = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }

            string wc = " ";
            var dp = new DynamicParameters();

            if (company != "" && company != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and rec.company like @company ";
                }
                else
                {
                    wc = wc + " where rec.company like @company ";
                }
                dp.Add("@company", '%' + company + '%');
            }
            if (name != "" && name != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and rec.FullName like @name ";
                }
                else
                {
                    wc = wc + " where rec.FullName like @name ";
                }
                dp.Add("@name", '%' + name + '%');
            }
            if (dept != "")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " and rec.Dept like @dept ";
                }
                else
                {
                    wc = wc + " where rec.Dept like @dept ";
                }
                dp.Add("@dept", '%' + dept + '%');
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
                sort = " order by LoanRec.FullName asc ";
            }

            try
            {
                if (!forexport)
                {
                    IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select count(*) Over() AS TotalRows, * from(select distinct  Rec.Empid,Rec.Company as Name,Rec.Employeecode as TIN,Rec.Fullname,Rec.Dept as FirstName,rec.SSS as SSSPHILHEALTHNo,rec.PhilHealthNo as MiddleName,rec.PagIbigNo as LastName,TINNo,rec.HireDate as DateReceived from ( "
                                                    + " select a.empId, c.Name as Company, b.EmployeeCode, b.FirstName + ' ' + b.MiddleName + ' ' + b.LastName as FullName, d.Name as Dept, b.SSS, b.PhilHealthNo, b.PagIbigNo, TINNo, b.HireDate from appEmployeeLoans as a "
                                                    + " left outer join Appemployee as b on a.empid = b.id left outer join AppSectors as c on b.SectorsId = c.id left outer join AppDepartment as d on b.DepartmentId = d.id where a.IsDeleted = 0 and a.Status = 'Active') as Rec " + wc + " ) "
                                                    + " as LoanRec " + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                    return getAll;


                }
                else
                {
                    IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select count(*) Over() AS TotalRows, * from(select distinct  Rec.Empid,Rec.Company as Name,Rec.Employeecode as TIN,Rec.Fullname,Rec.Dept as FirstName,rec.SSS as SSSPHILHEALTHNo,rec.PhilHealthNo as MiddleName,rec.PagIbigNo as LastName,TINNo,rec.HireDate as DateReceived from ( "
                                                    + " select a.empId, c.Name as Company, b.EmployeeCode, b.FirstName + ' ' + b.MiddleName + ' ' + b.LastName as FullName, d.Name as Dept, b.SSS, b.PhilHealthNo, b.PagIbigNo, TINNo, b.HireDate from appEmployeeLoans as a "
                                                    + " left outer join Appemployee as b on a.empid = b.id left outer join AppSectors as c on b.SectorsId = c.id left outer join AppDepartment as d on b.DepartmentId = d.id where a.IsDeleted = 0 and a.Status = 'Active') as Rec " + wc + " ) "
                                                    + " as LoanRec " + sort , dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmployeeLoans>> GetEmpLoanSSSListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');

            string empId = "";
            string LoanTitle = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    empId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    LoanTitle = tokens[1].ToString();
                }
            }

            string wc = " where a.IsDeleted = 0 and b.status = 'Active' ";
            var dp = new DynamicParameters();

            if (empId != "" && empId != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where b.EmpId = @empId ";
                }
                else
                {
                    wc = wc + " and b.EmpId = @empId ";
                }
                dp.Add("@empId", empId);
            }
            if (LoanTitle != "" && LoanTitle != "null")
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " where b.LoanTitle = @LoanTitle ";
                }
                else
                {
                    wc = wc + " and b.LoanTitle = @LoanTitle ";
                }
                dp.Add("@LoanTitle", LoanTitle);
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
                sort = " ";
            }

            try
            {
                IEnumerable<EmployeeLoans> getAll = await _repositoryEmployeeLoanssDapper.QueryAsync<EmployeeLoans>(" select a.EmpId,c.LoanTitleName,d.LoanTypeName,a.AppNo as ApplicationNo,a.AttId as fullName,b.LoanAmount,b.DateStart,b.DateEnd,b.MonthlyAmortization,a.StartDate as DateReceived from AppPayrollSSSLoan as a inner join appEmployeeLoans as b on a.AppNo = b.ApplicationNo "
                                                                                            + " inner join appLoanTitle as c on b.LoanTitle = c.Id inner join appLoanType as d on d.id = b.LoanType " + wc + sort, dp);
                return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
