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
    public class AttendanceManager : DomainService, IAttendanceManager
    {
        private readonly IRepository<Attendance> _repositoryAttendance;
        private readonly IDapperRepository<Attendance> _repositoryAttendanceDapper;

        public AttendanceManager(IRepository<Attendance> repository, IDapperRepository<Attendance> repositoryDapper)
        {
            _repositoryAttendance = repository;
            _repositoryAttendanceDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAttendanceAsync(Attendance entity)
        {
            var result = _repositoryAttendance.FirstOrDefault(x => x.Id == entity.Id);
            if (result != null)
            {
                throw new UserFriendlyException("Already exist!");
            }
            else
            {
                await _repositoryAttendance.InsertAsync(entity);
                return IdentityResult.Success;
            }
        }

        public async Task<IEnumerable<Attendance>> GetAttendanceAsync()
        {
            string wc = " Where IsDeleted = 0";
            string sort = " order by DateT desc";
            try
            {
                IEnumerable<Attendance> getAll = await _repositoryAttendanceDapper.QueryAsync<Attendance>("select distinct CAST(CreationTime AS DATE) as DateT,AttendanceId,Company from AppAttendance  " + wc + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }        

        public async Task<IEnumerable<Attendance>> GetAttendanceByIdAsync(string filter)
        {
            string wc = " Where (AttendanceId = @AttendanceId)";
            string sort = " order by NO,Name,Date asc ";
            var dp = new DynamicParameters();
            dp.Add("@AttendanceId", filter);
            try
            {
                IEnumerable<Attendance> getAll = await _repositoryAttendanceDapper.QueryAsync<Attendance>("select * from AppAttendance " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Attendance>> GetAttendanceByCodeAsync(string filter)
        {
            //start//
            string[] tokens = filter.Split('|');

            string EmpCode = "";
            string AttId = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    EmpCode = tokens[0];
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    AttId = tokens[1];
                }
            }

            //string wc = " Where IsDeleted = 0 ";
            string wc = "  ";
            var dp = new DynamicParameters();

            if (EmpCode != "null")
            {
                wc = wc + " Where (No = @no) ";
                dp.Add("@no", EmpCode);
            }

            if (AttId != "null")
            {
                wc = wc + " And (AttendanceId = @AttId) ";
                dp.Add("@AttId", AttId);
            }
            string sort = " order by NO,Name,Date asc ";
            try
            {
                IEnumerable<Attendance> getAll = await _repositoryAttendanceDapper.QueryAsync<Attendance>("select * from AppAttendance " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Attendance>> GetAttendance(string filter)
        {
            //start//
            string[] tokens = filter.Split('|');

            string EmpCode = "";
            string AttId = "";
            string DateFrom = "";
            string DateTo = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    EmpCode = tokens[0];
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    AttId = tokens[1];
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[2].ToString() != "null")
                {
                    DateFrom = tokens[2];
                }
            }
            if (tokens.Length > 1)
            {
                if (tokens[3].ToString() != "null")
                {
                    DateTo = tokens[3];
                }
            }

            string wc = " ";
            string wc2 = " ";
            string wc3 = " ";
            string wc4 = " ";
            var dp = new DynamicParameters();


            if (DateFrom != "null")
            {
                wc2 =  " @DateFrom ";
                dp.Add("@DateFrom", DateFrom);
            }
            if (DateTo != "null")
            {
                wc3 = " @DateTo ";
                dp.Add("@DateTo", DateTo);
            }
            if (EmpCode != "null")
            {
                wc4 = " @no ";
                dp.Add("@no", EmpCode);
            }
            if (EmpCode != "null")
            {
                wc = wc + " where No = @no ";
                dp.Add("@no", EmpCode);
            }
            
            if (AttId != "null")
            {
                if(EmpCode != "null")
                { 
                    wc = wc + " And (AttendanceId = @AttId) ";                    
                }
                else
                {
                    wc = wc + " where (AttendanceId = @AttId) ";
                }
                dp.Add("@no", EmpCode);
                dp.Add("@AttId", AttId);
            }
            try
            {
                IEnumerable<Attendance> getAll = await _repositoryAttendanceDapper.QueryAsync<Attendance>("   ;DECLARE @MinDate DATE = @DateFrom, @MaxDate DATE = @DateTo "
                            + " ; WITH dates_CTE(date) as (select @MinDate Union ALL select DATEADD(day, 1, date) from dates_CTE where date < @MaxDate),  "
                            + " TimeIn AS(select Row_Number() Over(Partition by DateIn Order By DateIn desc, TimeIn asc)  As Row1, V1.*from(Select distinct CAST(date AS DATE) as DateIn, FORMAT(date, 'HH:mm') as TimeIn, No, AttendanceId from AppAttendance " + wc + " and IsDeleted = 0) as V1), "
                            + " TimesOut AS(select Row_Number() Over(Partition by DateIn Order By DateIn desc, TimeOut desc) As Row2, V2.TimeOut, V2.DateIn from(Select distinct CAST(date AS DATE) as DateIn, FORMAT(date, 'HH:mm') as TimeOut, No, AttendanceId from AppAttendance " + wc + " and IsDeleted = 0) as V2), "
                            + " cte4 AS(Select Description,'Holiday' as EmpHoliday, DateFrom from APpHolidays where DateFrom > @MinDate and DateTo < @MaxDate ),cte5 AS(Select Description,'Leave' as EmpLeave, DateFrom, Le.EmployeeCode from appEmployeeLeaves as L inner join AppEmployee as LE on l.EmpId = LE.Id where l.Status = 'Approved' and DateFrom > @DateFrom and DateTo < @DateTo and LE.EmployeeCode = @No) "
                            + " SELECT c1.No ,isnull(c1.AttendanceId, IsNull(c5.Description, 'Absent/RestDay')) as AttendanceId,c3.Date,c1.DateIn,c1.TimeIn,c2.TimeOut,IsNull(c4.Description, c5.Description) as Holiday,IsNull(c4.EmpHoliday, c5.EmpLeave) as EnTitlement FROM TimeIn as c1 "
                            + " full outer join TimesOut as c2 on c1.DateIn = c2.DateIn right outer join dates_CTE as c3 on c1.DateIn = c3.Date left outer join cte4 as c4 on c3.Date = c4.DateFrom left outer join cte5 as c5 on c3.Date = c5.DateFrom WHERE c1.row1 is null or c1.Row1 = '1' and c2.row2 = '1' or c2.row2 is null order by date asc  ", dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Attendance> GetTop1AttendanceAscAsync(string AttId)
        {
            string wc = " Where AttendanceId = @Filter ";
            string sort = " order by Date asc ";
            var dp = new DynamicParameters();
            dp.Add("@Filter", AttId);
            try
            {
                IEnumerable<Attendance> getAll = await _repositoryAttendanceDapper.QueryAsync<Attendance>("select top 1 * from appAttendance  " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Attendance> GetTop1AttendanceDescAsync(string AttId)
        {
            string wc = " Where AttendanceId = @Filter  ";
            string sort = " order by Date desc ";
            var dp = new DynamicParameters();
            dp.Add("@Filter", AttId);
            try
            {
                IEnumerable<Attendance> getAll = await _repositoryAttendanceDapper.QueryAsync<Attendance>("select top 1 * from appAttendance  " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Attendance> GetRestdaycAsync(int EmpId, string Day)
        {
            string wc = " Where EmpId in (0, @EmpId) and days = @Day and IsDeleted = 0";
            string sort = "";
            var dp = new DynamicParameters();
            dp.Add("@EmpId", EmpId);
            dp.Add("@Day", Day);
            try
            {
                IEnumerable<Attendance> getAll = await _repositoryAttendanceDapper.QueryAsync<Attendance>("select * from appEmployeeRestday  " + wc + sort, dp);
                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Attendance>> GetAttAsync()
        {
            string wc = " Where IsDeleted = 0";
            string sort = " order by AttendanceId desc";
            try
            {
                IEnumerable<Attendance> getAll = await _repositoryAttendanceDapper.QueryAsync<Attendance>("select distinct AttendanceId,CAST(Startdate AS DATE) as Startdate , CAST(EndDate AS DATE) as EndDate from AppAttendance2  " + wc + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
