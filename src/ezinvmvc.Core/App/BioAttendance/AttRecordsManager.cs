using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.BioAttendance.Models
{
    public class AttRecordsManager : DomainService, IAttRecordsManager
    {
        private readonly IRepository<AttRecords> _repository;
        private readonly IDapperRepository<AttRecords> _repositoryDapper;

        public AttRecordsManager(IRepository<AttRecords> repository, IDapperRepository<AttRecords> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }


        public async Task<IEnumerable<AttRecords>> GetAttRecAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string datefrom = "";
            string dateto = "";
            string EmpId = "";
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
                    EmpId = tokens[2].ToString();
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
            var dp2 = new DynamicParameters();
            string wc2 = " ";
            var dp = new DynamicParameters();

            if ((datefrom != "" && datefrom != "null") && (dateto != "" && dateto != "null"))
            {
                if (string.IsNullOrEmpty(wc))
                {
                    wc = wc + " declare @Date1 date = @StartDate  " +
                              " declare @Date2 date = @EndDate " +
                              " declare @Dates table(Datev date) " +
                              " while @Date1 <= @Date2 " +
                              " begin " +
                              " insert into @Dates(Datev ) values(@Date1) " +
                              " set @Date1 = DateAdd(Day, 1, @Date1) " +
                              " end ";
                }
                else
                {
                    wc = wc + " declare @Date1 date = @StartDate  " +
                              " declare @Date2 date = @EndDate  " +
                              " declare @Dates table(Datev date) " +
                              " while @Date1 <= @Date2 " +
                              " begin " +
                              " insert into @Dates(Datev ) values(@Date1) " +
                              " set @Date1 = DateAdd(Day, 1, @Date1) " +
                              " end ";
                }
                dp2.Add("@StartDate", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp2.Add("@EndDate", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            if (EmpId != "")
            {
                if (string.IsNullOrEmpty(wc2))
                {
                    wc2 = wc2 + " and EmpId = @EmpId ";
                }
                else
                {
                    wc2 = wc2 + " where EmpId = @EmpId ";
                }
                dp.Add("@EmpId", EmpId);
            }
            if (Attid != "")
            {
                if (string.IsNullOrEmpty(wc2))
                {
                    wc2 = wc2 + " where AttendanceId = @Attid ";
                }
                else
                {
                    wc2 = wc2 + " and  AttendanceId = @Attid ";
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
                sort = " order by f.Datev asc ";
            }

            try
            {
                IEnumerable<AttRecords> getAll = await _repositoryDapper.QueryAsync<AttRecords>(wc + " select Rec.id as AttId,count(*) Over() AS TotalRows2,Rec.TotalRows, Rec.AttendanceId,Rec.EmpId,Rec.EmployeeCode,Rec.Department,Rec.DateRecorded,Rec.StartDate,Rec.EndDate,Rec.Name, " +
                                                " e.Description as Holidays, e.Rates as HolRates, f.Datev, f.Day, Rec.AttDate, Rec.TimeIn, Rec.LunchOut, Rec.LunchIn, Rec.TimeOut, Rec.Timesched1id, Rec.Payrollrateid, Rec.FlexiTime, Rec.AMIn, Rec.BreakOut, Rec.BreakIn, Rec.PmOut, Rec.AmLateIn, Rec.AmLAteEndIn from " +
                                                " (select  count(*) Over() AS TotalRows, a.id, a.AttendanceId, b.Id as EmpId, b.EmployeeCode, a.Department, a.DateRecorded, a.StartDate, a.EndDate, isnull(b.LastName + ' ' + b.FirstName + ' ' + b.MiddleName, a.Name) as Name," +
                                                " a.Date as AttDate, a.AMIn as [TimeIn], a.AMOut as [LunchOut], a.PMIn as [LunchIn], a.PMOut as TimeOut, c.Timesched1id, c.Payrollrateid, d.FlexiTime, d.AMIn, d.BreakOut, d.BreakIn, d.pmOut, d.amLateIn, d.amLAteEndIn " +
                                                " from appAttendance2 as a " +
                                                " inner join(select * from appemployee where isdeleted = 0 and EmployeeCode > '') as b on a.no = b.EmployeeCode " +
                                                " inner join(select * from appEmpSalaries where isdeleted = 0 and getdate() between StartDate  and[EndDate]) as c on b.id = c.EmpId " +
                                                " inner join(select * from AppTimeSched where isdeleted = 0) as d on c.Timesched1id = d.Id " +
                                                wc2 + " and a.isdeleted = '0') as Rec " +
                                                " right outer join(select Datev, DATENAME(dw, Datev) 'Day' from @Dates) as f on Rec.AttDate = f.Datev " +
                                                " left outer join(select * from AppHolidays where status = 'Active') as e on f.Datev = e.DateFrom  " + sort);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
