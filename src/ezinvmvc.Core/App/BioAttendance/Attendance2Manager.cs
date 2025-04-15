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

namespace ezinvmvc.App.BioAttendance.Models
{
    public class Attendance2Manager : DomainService, IAttendance2Manager
    {
        private readonly IRepository<Attendance2> _repository;
        private readonly IDapperRepository<Attendance2> _repositoryDapper;

        public Attendance2Manager(IRepository<Attendance2> repository, IDapperRepository<Attendance2> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Attendance2 entity)
        {
            //var result = _repository.FirstOrDefault(x => x.Id == entity.Id && x.AttendanceId == entity.AttendanceId );

            var result = _repository.FirstOrDefault(x => x.AttendanceId == entity.AttendanceId);
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

        public async Task<IEnumerable<Attendance2>> GetAttendanceAsync(string filter, string sorting, int offset, int fetch)
        {
            string[] tokens = filter.Split('|');
            var dp = new DynamicParameters();

            string wc = "";
            string sort = " order by c.DateT desc";
            try
            {
                //IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select distinct CAST(DateRecorded AS DATE) as DateT,a.AttendanceId,Department as CompanyName, from AppAttendance2 as a inner join AppCompany as b on a.Company = b.Id  " + wc + sort);
                //IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select distinct CAST(DateRecorded AS DATE) as DateT,a.AttendanceId,Department as CompanyName, CAST(StartDate AS DATE) as StartDate ,CAST(EndDate AS DATE) as EndDate from AppAttendance2 as a inner join AppCompany as b on a.Company = b.Id  " + wc + sort);
                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select count(*) Over() AS TotalRows, * from (select distinct CAST(DateRecorded AS DATE) as DateT,a.AttendanceId,Department as CompanyName, CAST(StartDate AS DATE) as StartDate ,CAST(EndDate AS DATE) as EndDate from AppAttendance2 as a inner join AppCompany as b on a.Company = b.Id Where a.IsDeleted = 0) as c " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " Rows Only", dp);
                return getAll;
            }

            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
        
        public async Task<IEnumerable<Attendance2>> GetAttIdAsync()
        {
            string wc = " Where IsDeleted = 0";
            string sort = " order by DateT desc";
            try
            {
                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select distinct CAST(DateRecorded AS DATE) as DateT,AttendanceId from AppAttendance2  " + wc + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Attendance2>> GetAttendanceByIdAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string attId = "";
            string Company = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    attId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    Company = tokens[1].ToString();
                }
            }

            string wc = " where Isdeleted = 0 ";
            var dp = new DynamicParameters();
            //dp.Add("@AttendanceId", filter);

            if (attId != "")
            {
                wc = wc + " and AttendanceId = @attId ";
                dp.Add("@attId", attId);
            }
            if (Company != "")
            {
                wc = wc + " and Department = @Company ";
                dp.Add("@Company", Company);
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
                sort = " order by NO,Date asc ";
            }


            try
            {
                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select * from AppAttendance2 " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> DeleteAsync(int id)
        {

            //var result = _repository.FirstOrDefault(x => x.Id == id);
            //if (result != null)
            //{
            //    await _repository.DeleteAsync(result);
            //    return IdentityResult.Success;
            //}
            //else
            //{
            //    throw new UserFriendlyException("No Data Found!");
            //}

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

        public async Task<IdentityResult> UpdateAsync(Attendance2 entity)
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

        //Adjustment Form//

        public async Task<IEnumerable<Attendance2>> GetAttendanceByAttIdandCompname(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string attId = "";
            string Company = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    attId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    Company = tokens[1].ToString();
                }
            }

            string wc = " where a.Isdeleted = 0 and b.Isdeleted = 0";
            string wc2 = " ";
            var dp = new DynamicParameters();

            if (attId != "")
            {
                wc = wc + " and a.AttendanceId = @attId ";
                wc2 = wc2 + " where attid = @attId and Isdeleted = 0 ";
                dp.Add("@attId", attId);
            }
            if (Company != "")
            {
                wc = wc + " and a.Department = @Company ) as Allin where OT not in (select empid as id from AppPayroll " + wc2 +" ) ";
                dp.Add("@Company", Company);
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
                sort = " order by allin.OT desc ";
            }


            try
            {
                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("Select * from (Select distinct CAST(DateRecorded AS DATE) as DateT,AttendanceId,isnull(b.id, 0) as OT,No,isnull(b.LastName +' '+ b.FirstName +' '+ b. MiddleName , a.Name) as Name ,Department,a.StartDate,a.EndDate from appAttendance2 as a left outer join AppEmployee as b on a.No = b.EmployeeCode " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Attendance2>> GetAttendanceByNo(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string attId = "";
            string Company = "";
            string No = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    attId = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    Company = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    No = tokens[2].ToString();
                }
            }

            string wc = " where Isdeleted = 0 ";
            var dp = new DynamicParameters();

            if (attId != "")
            {
                wc = wc + " and AttendanceId = @attId ";
                dp.Add("@attId", attId);
            }
            if (Company != "")
            {
                wc = wc + " and Department = @Company ";
                dp.Add("@Company", Company);
            }
            if (No != "")
            {
                wc = wc + " and No = @No ";
                dp.Add("@No", No);
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
                sort = " order by Date";
            }


            try
            {
                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select * from AppAttendance2" + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> CreateTime(Attendance2 entity)
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

        public async Task<IEnumerable<Attendance2>> GetAttAdjReport(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string empid = "";
            string attid = "";
            string dept = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    empid = tokens[0].ToString();
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    attid = tokens[1].ToString();
                }
            }
            if (tokens.Length > 2)
            {
                if (tokens[2].ToString() != "null")
                {
                    dept = tokens[2].ToString();
                }
            }
            string wc = " where a.Isdeleted = 0 ";

            string AtId = "";
            string wc2 = "";
            var dp = new DynamicParameters();

            if (empid != "")
            {
                wc = wc + " and c.EmployeeCode = @empid ";
                dp.Add("@empid", empid);
            }
            if (attid != "")
            {
                wc = wc + " and a.Attid = @attid ";
                AtId = AtId + "@attid";
                dp.Add("@attid", attid);
            }
            if (dept != "")
            {
                wc = wc + " and d.Department Like @dept ";
                wc2 = wc2 + " and Department Like @dept ";
                dp.Add("@dept", "%" + dept + "%");
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
                sort = " order by Rep.EmployeeCode";
            }


            try
            {
                //IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select rep.Department as Department,Rep.Attid as AttendanceId,Rep.EmployeeCode as No,Rep.Name, sum(Cast(Basic as decimal(18,2)))as Description1, sum(Cast(Absences as decimal(18,2)))as Description2, sum(Cast(Late as decimal(18,2)))as Late, sum(Cast(Undertime as decimal(18,2)))as UTime, sum(Cast(Overtime as decimal(18,2)))as Description3, sum(Cast(Leave as decimal(18,2)))as EnTitlement, sum(Cast(Others as decimal(18,2)))as Description4 , sum(Cast(days as decimal(18,2)))as Days,isnull(sum(Cast(Basic as decimal(18,2))) + sum(Cast(Absences as decimal(18,2))) + sum(Cast(Late as decimal(18,2))) + sum(Cast(Undertime as decimal(18,2))) + sum(Cast(Overtime as decimal(18,2))) + sum(Cast(Leave as decimal(18,2))) + sum(Cast(Others as decimal(18,2))) +sum(Cast(days as decimal(18,2))),'0.00') as Attid  from "
                //                                                                                + " (select t1.Attid, t1.EmployeeCode, t1.Name, isnull(t2.Attadjamount, '0.00') as Basic, isnull(t3.Attadjamount, '0.00') as Absences, isnull(t4.Attadjamount, '0.00') as Late, isnull(t5.Attadjamount, '0.00') as Undertime, isnull(t6.Attadjamount, '0.00') as Overtime, isnull(t7.Attadjamount, '0.00') as Leave, isnull(t8.Attadjamount, '0.00') as Others, isnull(t9.Attadjamount, '0.00') as Days, t1.Department "
                //                                                                                + " from(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t1 "
                //                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t2 on t1.Types = T2.Types and t1.EmployeeCode = t2.EmployeeCode and T2.Types = 'Salary' "
                //                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t3 on t1.Types = T3.Types and t1.EmployeeCode = t3.EmployeeCode and T3.Types = 'Absent' "
                //                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t4 on t1.Types = T4.Types and t1.EmployeeCode = t4.EmployeeCode and T4.Types = 'Tardiness' "
                //                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t5 on t1.Types = T5.Types and t1.EmployeeCode = t5.EmployeeCode and T5.Types = 'Undertime' "
                //                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t6 on t1.Types = T6.Types and t1.EmployeeCode = t6.EmployeeCode and T6.Types = 'Overtime' "
                //                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t7 on t1.Types = T7.Types and t1.EmployeeCode = t7.EmployeeCode and T7.Types = 'Leave' "
                //                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t8 on t1.Types = T8.Types and t1.EmployeeCode = t8.EmployeeCode and T8.Types = 'Others' "
                //                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t9 on t1.Types = T9.Types and t1.EmployeeCode = t9.EmployeeCode and T9.Types = 'Days') as Rep "
                //                                                                                + " group by Rep.Attid, Rep.EmployeeCode, Rep.Name, rep.Department " + sort, dp);

                //IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select rep.Department as Department,Rep.Attid as AttendanceId,Rep.EmployeeCode as No,Rep.Name, sum(Cast(Basic as decimal(18,2)))as Description1, sum(Cast(Absences as decimal(18,2)))as Description2, sum(Cast(Late as decimal(18,2)))as Late, sum(Cast(Undertime as decimal(18,2)))as UTime, sum(Cast(Overtime as decimal(18,2)))as Description3, sum(Cast(Leave as decimal(18,2)))as EnTitlement, sum(Cast(Others as decimal(18,2)))as Description4 , sum(Cast(days as decimal(18,2)))as Days,isnull(sum(Cast(Basic as decimal(18,2))) + sum(Cast(Absences as decimal(18,2))) + sum(Cast(Late as decimal(18,2))) + sum(Cast(Undertime as decimal(18,2))) + sum(Cast(Overtime as decimal(18,2))) + sum(Cast(Leave as decimal(18,2))) + sum(Cast(Others as decimal(18,2))) +sum(Cast(days as decimal(18,2))),'0.00') as Attid  from  "
                //                                                                            + " (select t1.Attid, t1.EmployeeCode, t1.Name, isnull(t2.Attadjamount, '0.00') as Basic, isnull(t3.Attadjamount, '0.00') as Absences, isnull(t4.Attadjamount, '0.00') as Late, isnull(t5.Attadjamount, '0.00') as Undertime, isnull(t6.Attadjamount, '0.00') as Overtime, isnull(t7.Attadjamount, '0.00') as Leave, isnull(t8.Attadjamount, '0.00') as Others, isnull(t9.Attadjamount, '0.00') as Days, t1.Department "
                //                                                                            + " from(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = '121112252023' and Department Like '%MFT%' group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023'and d.Department Like '%MFT%') as t1 "
                //                                                                            + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2  where AttendanceId = '121112252023' and Department Like '%MFT%' group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023' and d.Department Like '%MFT%') as t2 on t1.Types = T2.Types and t1.EmployeeCode = t2.EmployeeCode and T2.Types = 'Salary' "
                //                                                                            + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = '121112252023' and Department Like '%MFT%'  group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023' and  d.Department Like '%MFT%') as t3 on t1.Types = T3.Types and t1.EmployeeCode = t3.EmployeeCode and T3.Types = 'Absent' "
                //                                                                            + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2  where AttendanceId = '121112252023' and Department Like '%MFT%' group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023' and  d.Department Like '%MFT%') as t4 on t1.Types = T4.Types and t1.EmployeeCode = t4.EmployeeCode and T4.Types = 'Tardiness' "
                //                                                                            + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2  where AttendanceId = '121112252023' and Department Like '%MFT%' group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023' and  d.Department Like '%MFT%') as t5 on t1.Types = T5.Types and t1.EmployeeCode = t5.EmployeeCode and T5.Types = 'Undertime' "
                //                                                                            + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2  where AttendanceId = '121112252023' and Department Like '%MFT%' group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023' and  d.Department Like '%MFT%') as t6 on t1.Types = T6.Types and t1.EmployeeCode = t6.EmployeeCode and T6.Types = 'Overtime' "
                //                                                                            + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = '121112252023' and Department Like '%MFT%' group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023' and  d.Department Like '%MFT%') as t7 on t1.Types = T7.Types and t1.EmployeeCode = t7.EmployeeCode and T7.Types = 'Leave' "
                //                                                                            + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = '121112252023' and Department Like '%MFT%' group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023' and  d.Department Like '%MFT%') as t8 on t1.Types = T8.Types and t1.EmployeeCode = t8.EmployeeCode and T8.Types = 'Others' "
                //                                                                            + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = '121112252023' and Department Like '%MFT%' group by no, attendanceid, Department) as d on d.no = c.EmployeeCode where a.Attid = '121112252023' and  d.Department Like '%MFT%') as t9 on t1.Types = T9.Types and t1.EmployeeCode = t9.EmployeeCode and T9.Types = 'Days') as Rep "
                //                                                                            + " group by Rep.Attid, Rep.EmployeeCode, Rep.Name, rep.Department " + sort, dp);

                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select rep.Department as Department,Rep.Attid as AttendanceId,Rep.EmployeeCode as No,Rep.Name, sum(Cast(Basic as decimal(18,2)))as Description1, sum(Cast(Absences as decimal(18,2)))as Description2, sum(Cast(Late as decimal(18,2)))as Late, sum(Cast(Undertime as decimal(18,2)))as UTime, sum(Cast(Overtime as decimal(18,2)))as Description3, sum(Cast(Leave as decimal(18,2)))as EnTitlement, sum(Cast(Others as decimal(18,2)))as Description4 , sum(Cast(days as decimal(18,2)))as Days,isnull(sum(Cast(Basic as decimal(18,2))) + sum(Cast(Absences as decimal(18,2))) + sum(Cast(Late as decimal(18,2))) + sum(Cast(Undertime as decimal(18,2))) + sum(Cast(Overtime as decimal(18,2))) + sum(Cast(Leave as decimal(18,2))) + sum(Cast(Others as decimal(18,2))) +sum(Cast(days as decimal(18,2))),'0.00') as Attid  from "
                                                                                                + " (select t1.Attid, t1.EmployeeCode, t1.Name, isnull(t2.Attadjamount, '0.00') as Basic, isnull(t3.Attadjamount, '0.00') as Absences, isnull(t4.Attadjamount, '0.00') as Late, isnull(t5.Attadjamount, '0.00') as Undertime, isnull(t6.Attadjamount, '0.00') as Overtime, isnull(t7.Attadjamount, '0.00') as Leave, isnull(t8.Attadjamount, '0.00') as Others, isnull(t9.Attadjamount, '0.00') as Days, t1.Department "
                                                                                                + " from(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = " + AtId + " " + wc2 + " group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t1 "
                                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2  where AttendanceId = " + AtId + " " + wc2 + " group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t2 on t1.Types = T2.Types and t1.EmployeeCode = t2.EmployeeCode and T2.Types = 'Salary' "
                                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = " + AtId + " " + wc2 + "  group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t3 on t1.Types = T3.Types and t1.EmployeeCode = t3.EmployeeCode and T3.Types = 'Absent' "
                                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2  where AttendanceId = " + AtId + " " + wc2 + " group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t4 on t1.Types = T4.Types and t1.EmployeeCode = t4.EmployeeCode and T4.Types = 'Tardiness' "
                                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2  where AttendanceId = " + AtId + " " + wc2 + " group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t5 on t1.Types = T5.Types and t1.EmployeeCode = t5.EmployeeCode and T5.Types = 'Undertime' "
                                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2  where AttendanceId = " + AtId + " " + wc2 + " group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t6 on t1.Types = T6.Types and t1.EmployeeCode = t6.EmployeeCode and T6.Types = 'Overtime' "
                                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = " + AtId + " " + wc2 + " group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t7 on t1.Types = T7.Types and t1.EmployeeCode = t7.EmployeeCode and T7.Types = 'Leave' "
                                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = " + AtId + " " + wc2 + " group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t8 on t1.Types = T8.Types and t1.EmployeeCode = t8.EmployeeCode and T8.Types = 'Others' "
                                                                                                + " left join(select a.*, b.Types, c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName as Name, c.EmployeeCode, d.Department from AppPayrollAttAdjustment as a left outer join AppAttAdjustmentTypes as b on a.AdjType = b.Id left outer join AppEmployee as c on a.EmpId = c.Id left outer join(select no, attendanceid, Department from appAttendance2 where AttendanceId = " + AtId + " " + wc2 + " group by no, attendanceid, Department) as d on d.no = c.EmployeeCode " + wc + ") as t9 on t1.Types = T9.Types and t1.EmployeeCode = t9.EmployeeCode and T9.Types = 'Days') as Rep "
                                                                                                + " group by Rep.Attid, Rep.EmployeeCode, Rep.Name, rep.Department " + sort, dp);
                return getAll;

            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Attendance2>> GetAttendanceRecordAsync(string filter, string sorting)
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
                dp.Add("@dept", "%"+ dept + "%");
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
                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>(" select count(*) Over() AS TotalRows, * from (select distinct  CAST(startDate AS DATE) as DateT,CAST(EndDate AS DATE) as EndDate,a.AttendanceId,Department from AppAttendance2 as a inner join AppCompany as b on a.Company = b.Id) as ab " + wc + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Attendance2> GetAttIdDataAsync(string AttendanceId)
        {
            string wc = " where attid = @id ";
            string sort = "";
            var dp = new DynamicParameters();
            dp.Add("@id", AttendanceId);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Attendance2>(" select top 1 cutoff as EnTitlement from AppPayroll " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
        
        public async Task<IEnumerable<Attendance2>> GetAttRecAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string empid = "";
            string attid = "";

            if (tokens.Length > 1)
            {
                if (tokens[0].ToString() != "null" && tokens[1].ToString() != "null")
                {
                    datefrom = tokens[0].ToString();
                    dateto = tokens[1].ToString();
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
                    attid = tokens[3].ToString();
                }
            }

            string wc = "";
            string ab = "";
            string cd = "";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " ; DECLARE @MinDate DATE = @StartDate1 , @MaxDate DATE = @EndDate2 ; with Extract_Dates_CTE(MyDate) as (select @MinDate Union ALL select DATEADD(day, 1, MyDate) from Extract_Dates_CTE where MyDate < @MaxDate) ";
                }
                else
                {
                    wc = wc + " ; DECLARE @MinDate DATE = @StartDate1 , @MaxDate DATE = @EndDate2 ; with Extract_Dates_CTE(MyDate) as (select @MinDate Union ALL select DATEADD(day, 1, MyDate) from Extract_Dates_CTE where MyDate < @MaxDate) ";

                }
                dp.Add("@StartDate1", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@EndDate2", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (empid != "")
            {
                if (string.IsNullOrEmpty(ab))
                {
                    ab = ab + " where isdeleted = 0 and no = @EmpId ";
                }
                else
                {
                    ab = ab + " where isdeleted = 0 and no = @EmpId ";
                }
                dp.Add("@EmpId", empid);
            }
            
            if (attid != "")
            {
                if (string.IsNullOrEmpty(ab))
                {
                    ab = ab + " and AttendanceId = @Attid ";
                }
                else
                {
                    ab = ab + " and AttendanceId = @Attid ";
                }
                dp.Add("@Attid", attid);
            }
            if (empid != "")
            {
                if (string.IsNullOrEmpty(cd))
                {
                    cd = cd + " where isdeleted = 0 and EmployeeCode = @MemEmpId ";
                }
                else
                {
                    cd = cd + "";
                }
                dp.Add("@MemEmpId", empid);
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
                sort = " order by a.MyDate asc ";
            }

            try
            {
                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>( wc + " select count(*) Over() AS TotalRows, a.MyDate AS Datev,FORMAT(a.MyDate, 'dddd') AS Day, b.TotalRows2,f.Description as Holidays,f.Rates,b.AttendanceId as AttId,isnull(c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName, c.Name) as Name,c.Id as EmpId,b.No as EmployeeCode,b.Department,b.Date as AttDate,b.AMIn as TimeIn,b.AMOut as LunchOut,b.PMIn as LunchIn,b.PMOut as TimeOut,b.DateRecorded,b.StartDate,b.EndDate, " +
                                                                                                  " d.Timesched1id,d.Payrollrateid,e.FlexiTime,e.AMIn,e.BreakOut,e.BreakIn,e.pmOut,e.amLateIn,e.amLAteEndIn,e.WithOverTime as Status1 ,d.Workers as Status2,b.Status3 as Status3,b.Description1,f.OTRateDescription as Description2 ,f.Rates as Description3 ,d.shift as Description4 " +

                                                                                                  " from Extract_Dates_CTE a " +
                                                                                                  " left outer join(select count(*) Over() AS TotalRows2, *from appAttendance2 " + ab + " ) as b on a.MyDate = b.Date " +
                                                                                                  " left outer join(select * from AppEmployee " + cd + ") as c on c.EmployeeCode = b.No " +
                                                                                                  " left outer join(select * from appEmpSalaries where isdeleted = 0 and getdate() between StartDate  and[EndDate]) as d on d.EmpId = c.Id " +
                                                                                                  " left outer join(select * from AppTimeSched where isdeleted = 0) as e on d.Timesched1id = e.Id " +
                                                                                                  " left outer join(select * from AppHolidays where status = 'Active') as f on a.MyDate between f.DateFrom and f.DateTo " + sort, dp);
                return getAll;
                //IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>(" DECLARE @DateStart DATE = '2022-12-16' , @DateEnd DATE = '2022-12-31';  " +
                //                                                                                  " with Extract_Dates_CTE(MyDate) as (select @DateStart Union ALL select DATEADD(day, 1, MyDate) from Extract_Dates_CTE where MyDate < @DateEnd) " +

                //                                                                                  " select count(*) Over() AS TotalRows, a.MyDate AS Datev,FORMAT(a.MyDate, 'dddd') AS Day, b.TotalRows2,f.Description as Holidays,f.Rates,b.AttendanceId as AttId,isnull(c.LastName + ' ' + c.FirstName + ' ' + c.MiddleName, c.Name) as Name,c.Id as EmpId,b.No as EmployeeCode,b.Department,b.Date as AttDate,b.AMIn as TimeIn,b.AMOut as LunchOut,b.PMIn as LunchIn,b.PMOut as TimeOut,b.DateRecorded,b.StartDate,b.EndDate, " +
                //                                                                                  " d.Timesched1id,d.Payrollrateid,e.FlexiTime,e.AMIn,e.BreakOut,e.BreakIn,e.pmOut,e.amLateIn,e.amLAteEndIn " +

                //                                                                                  " from Extract_Dates_CTE a " +
                //                                                                                  " left outer join(select count(*) Over() AS TotalRows2, *from appAttendance2 where isdeleted = 0 and no = '3' and AttendanceId = 'AttId01') as b on a.MyDate = b.Date " +
                //                                                                                  " left outer join(select * from AppEmployee where isdeleted = 0 and EmployeeCode = '3') as c on c.EmployeeCode = b.No " +
                //                                                                                  " left outer join(select * from appEmpSalaries where isdeleted = 0 and getdate() between StartDate  and[EndDate]) as d on d.id = c.Id " +
                //                                                                                  " left outer join(select * from AppTimeSched where isdeleted = 0) as e on d.Timesched1id = e.Id " +
                //                                                                                  " left outer join(select * from AppHolidays where status = 'Active') as f on a.MyDate between f.DateFrom and f.DateTo " + sort);
                //return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Attendance2>> GetAttAsync()
        {
            string wc = " Where IsDeleted = 0";
            string sort = " order by AttendanceId desc";
            try
            {
                IEnumerable<Attendance2> getAll = await _repositoryDapper.QueryAsync<Attendance2>("select distinct AttendanceId,CAST(Startdate AS DATE) as Startdate , CAST(EndDate AS DATE) as EndDate from AppAttendance2 " + wc + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

    }
}
