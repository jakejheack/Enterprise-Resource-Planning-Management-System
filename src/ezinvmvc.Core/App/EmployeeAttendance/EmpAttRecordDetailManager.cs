using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.EmployeeAttendance
{
    public class EmpAttRecordDetailManager : DomainService, IEmpAttRecordDetailManager
    {
        private readonly IRepository<EmpAttRecordDetail> _repository;
        private readonly IDapperRepository<EmpAttRecordDetail> _repositoryDapper;

        public EmpAttRecordDetailManager(IRepository<EmpAttRecordDetail> repository, IDapperRepository<EmpAttRecordDetail> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(EmpAttRecordDetail entity)
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

        public async Task<IdentityResult> DeleteEmpAttDetailAsync(int id)
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

        public async Task<IEnumerable<EmpAttRecordDetail>> GetEmpAttDetailAsync(string filter)
        {

            string[] tokens = filter.Split('|');
            string EmpId = "0";
            string AttRecId = "0";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "0")
                {
                    EmpId = tokens[0];
                }
                if (tokens[1].ToString() != "0")
                {
                    AttRecId = tokens[1];
                }
            }


            var dp = new DynamicParameters();
            string wc = " Where IsDeleted = '0' ";

            if (EmpId != "0")
            {
                wc = wc + " And (EmpId = @EmpId) ";
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                wc = wc + " And (EmpId = @EmpId) ";
                dp.Add("@EmpId", "0");
            }

            if (AttRecId != "0")
            {
                wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@AttRecId", AttRecId);
            }
            else
            {
                wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@AttRecId", "0");
            }

            string sort = " order by date asc ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select * from AppEmployeeAttRecordDetails " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }            
        }

        public async Task<IdentityResult> UpdateEmpAttDetailsAsync(EmpAttRecordDetail entity)
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

        public async Task<IEnumerable<EmpAttRecordDetail>> GetBasicSalaryCurrentAsync(int EmpId, string AttRecId)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != '0')
            {
                //wc = wc + " EmpId = @EmpId";
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                //wc = wc + " And (EmpId = @EmpId) ";
                dp.Add("@EmpId", '0');
            }

            if (AttRecId != "0")
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@AttRecId", AttRecId);
            }
            else
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@AttRecId", "0");
            }

            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select COUNT (Hours) as BasicSalaryCurrent from AppEmployeeAttRecordDetails where isdeleted = 0 and EmpId = @EmpId  and AttRecId = @AttRecId and Days not in (select days from AppEmployeeRestday where EmpId in (@EmpId,'0')) " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetAbsensesCurrentAsync(int EmpId, string AttRecId)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != '0')
            {
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                dp.Add("@EmpId", '0');
            }

            if (AttRecId != "0")
            {
                dp.Add("@AttRecId", AttRecId);
            }
            else
            {
                dp.Add("@AttRecId", "0");
            }

            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select COUNT (Hours) as AbsensesCurrent from AppEmployeeAttRecordDetails where isdeleted = 0 and EmpId = @EmpId and AttRecId = @AttRecId and Days not in (select days from AppEmployeeRestday where EmpId in (@EmpId, 0)) and DateIn is null and Status in ('Active', 'Disapproved') " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetTardinessCurrentAsync(int EmpId, string AttRecId)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != '0')
            {
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                dp.Add("@EmpId", '0');
            }

            if (AttRecId != "0")
            {
                dp.Add("@AttRecId", AttRecId);
            }
            else
            {
                dp.Add("@AttRecId", "0");
            }

            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>(" SELECT CAST(FORMAT((SUM((DATEPART(ss,late) + DATEPART(mi,late) * 60 + DATEPART(hh,late) * 3600)) / 3600),'00') as varchar(max)) + ':' +  CAST(FORMAT((SUM((DATEPART(ss,late) + DATEPART(mi,late) * 60 + DATEPART(hh,late) * 3600)) % 3600 / 60),'00') as varchar(max)) + ':' + CAST(FORMAT((SUM((DATEPART(ss,late) + DATEPART(mi,late) * 60 + DATEPART(hh,late) * 3600)) % 3600 % 60),'00') as varchar(max)) as TardinessCurrent FROM AppEmployeeAttRecordDetails  where isdeleted = 0 and EmpId = @EmpId and AttRecId = @AttRecId and Days not in (select days from AppEmployeeRestday where EmpId in (@EmpId,0) ) and Late <> '00:00' and Status in ('Active') " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetUndertimeCurrentAsync(int EmpId, string AttRecId)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != '0')
            {
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                dp.Add("@EmpId", '0');
            }

            if (AttRecId != "0")
            {
                dp.Add("@AttRecId", AttRecId);
            }
            else
            {
                dp.Add("@AttRecId", "0");
            }

            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>(" SELECT CAST(FORMAT((SUM((DATEPART(ss,Utime) + DATEPART(mi,Utime) * 60 + DATEPART(hh,Utime) * 3600)) / 3600),'00') as varchar(max)) + ':' +  CAST(FORMAT((SUM((DATEPART(ss,Utime) + DATEPART(mi,Utime) * 60 + DATEPART(hh,Utime) * 3600)) % 3600 / 60),'00') as varchar(max)) + ':' + CAST(FORMAT((SUM((DATEPART(ss,Utime) + DATEPART(mi,Utime) * 60 + DATEPART(hh,Utime) * 3600)) % 3600 % 60),'00') as varchar(max)) as UndertimeCurrent FROM AppEmployeeAttRecordDetails where  EmpId = @EmpId and AttRecId = @AttRecId and Days not in (select days from AppEmployeeRestday where EmpId in (@EmpId,0)) and Utime > '00:00' and Status  = 'Active' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetRGOTCurrentAsync(int EmpId, string AttRecId)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != '0')
            {
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                dp.Add("@EmpId", '0');
            }

            if (AttRecId != "0")
            {
                dp.Add("@AttRecId", AttRecId);
            }
            else
            {
                dp.Add("@AttRecId", "0");
            }

            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>(" select SUM (OT) as RGOTCurrent from AppEmployeeAttRecordDetails where isdeleted = 0 and EmpId = @EmpId and AttRecId = @AttRecId and OT > '0' and Status = 'Active' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetSSSCurrentAsync(decimal SSSAmount)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (SSSAmount != '0')
            {
                dp.Add("@SSSAmount", SSSAmount);
            }
            else
            {
                dp.Add("@SSSAmount", '0');
            }

            string sort = " order by Id desc ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>(" select Top 1 * from AppSSS where Start < @SSSAmount and Isdeleted = 0 " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetPhilhealthCurrentAsync()
        {
            var dp = new DynamicParameters();
            string wc = " ";

            string sort = " order by Id desc ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select * from AppPhilHealth where  Year = datepart(YEAR, getdate()) and IsDeleted = 0 " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }

        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetPagIbigCurrentAsync()
        {
            var dp = new DynamicParameters();
            string wc = " ";            

            string sort = " order by Id desc ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select * from AppPagIbig where  Year = datepart(YEAR, getdate())  and IsDeleted = 0 " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }

        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetBasicSalaryAdjustmentAsync(int EmpId, string AttRecId)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != '0')
            {
                //wc = wc + " EmpId = @EmpId";
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                //wc = wc + " And (EmpId = @EmpId) ";
                dp.Add("@EmpId", '0');
            }

            if (AttRecId != "0")
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@AttRecId", AttRecId);
            }
            else
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@AttRecId", "0");
            }

            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>(" select COUNT (HolidayLeave) as BasicSalaryAdjustment from AppEmployeeAttRecordDetails where isdeleted = 0 and EmpId = @EmpId and AttRecId = @AttRecId and HolidayLeave != '' and DateIn !='' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetTaxAmountAsync(string Compensation, decimal SSSAmount)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (SSSAmount != '0')
            {
                dp.Add("@SSSAmount", SSSAmount);
            }
            else
            {
                dp.Add("@SSSAmount", '0');
            }

            if (Compensation != "")
            {
                dp.Add("@Compensation", Compensation);
            }
            else
            {
                dp.Add("@Compensation", "");
            }

            string sort = " order by id asc ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>(" select top 1 * from AppTax where Compensation = @Compensation and Startamount < @SSSAmount and Isdeleted = '0' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetLoanAsync(int EmpId, int LoanTitle)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != '0')
            {
                //wc = wc + " EmpId = @EmpId";
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                //wc = wc + " And (EmpId = @EmpId) ";
                dp.Add("@EmpId", '0');
            }

            if (LoanTitle != '0')
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@LoanTitle", LoanTitle);
            }
            else
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@LoanTitle", "0");
            }

            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select sum(LoanAmount) as SSSLoanCurrent,sum(MonthlyAmortization) as SSSLoanAdjustment,sum(EmpLoans) as SSSLoanAmount from (select CASE WHEN DeductionType = 1 THEN MonthlyAmortization/1 WHEN DeductionType = 2 THEN MonthlyAmortization/3  WHEN DeductionType = 3 THEN MonthlyAmortization/2 WHEN DeductionType = 4 THEN MonthlyAmortization/1 END as EmpLoans,* from appEmployeeLoans Where IsDeleted = 0 And(EmpId = @EmpId) and status = 'Active' and LoanTitle = @LoanTitle and SYSDATETIME() > DateStart) as LOANS " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetTaxAmountDailyAsync(string compensation, decimal SSSAmount)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (SSSAmount != '0')
            {
                dp.Add("@SSSAmount", SSSAmount);
            }
            else
            {
                dp.Add("@SSSAmount", '0');
            }

            if (compensation != "")
            {
                dp.Add("@Compensation", compensation);
            }
            else
            {
                dp.Add("@Compensation", "");
            }

            string sort = " order by id desc ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>(" select top 1 * from AppTax where Compensation = @Compensation and Startamount < @SSSAmount and Isdeleted = '0' " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<EmpAttRecordDetail>> GetLoanListAsync(string filter)
        {
            string[] tokens = filter.Split('|');
            string EmpId = "0";
            string LoanTitle = "0";
            string DedId = "0";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "0")
                {
                    EmpId = tokens[0];
                }
                if (tokens[1].ToString() != "0")
                {
                    LoanTitle = tokens[1];
                }
                if (tokens[2].ToString() != "0")
                {
                    DedId = tokens[2];
                }
            }

            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != "0")
            {
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                dp.Add("@EmpId", "0");
            }

            if (LoanTitle != "0")
            {
                dp.Add("@LoanTitle", LoanTitle);
            }
            else
            {
                dp.Add("@LoanTitle", "0");
            }

            if (DedId != "0")
            {
                dp.Add("@DedId", DedId);
            }
            else
            {
                dp.Add("@DedId", "0");
            }
            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select a.*,CASE WHEN a.DeductionType = 1 THEN a.MonthlyAmortization/1 WHEN a.DeductionType = 2 THEN a.MonthlyAmortization/3  WHEN a.DeductionType = 3 THEN a.MonthlyAmortization WHEN a.DeductionType = 4 THEN MonthlyAmortization/1 END as EmpLoan,b.LoanTypeName,c.Status  as DeductionType from appEmployeeLoans as a inner join appLoanType as b on a.LoanType = b.id inner join AppHRStatusTypes as c on a.DeductionType = c.Id Where a.IsDeleted = 0 And(EmpId = @EmpId) and a.status = 'Active' and LoanTitle = @LoanTitle and SYSDATETIME() > DateStart and a.DeductionType IN (1, @DedId) " + wc + sort, dp);
                //IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select sum(LoanAmount) as SSSLoanCurrent,sum(MonthlyAmortization) as SSSLoanAdjustment,sum(EmpLoans) as SSSLoanAmount from (select CASE WHEN DeductionType = 1 THEN MonthlyAmortization/1 WHEN DeductionType = 2 THEN MonthlyAmortization/3  WHEN DeductionType = 3 THEN MonthlyAmortization/2 WHEN DeductionType = 4 THEN MonthlyAmortization/1 END as EmpLoans,* from appEmployeeLoans Where IsDeleted = 0 And(EmpId = @EmpId) and status = 'Active' and LoanTitle = @LoanTitle and SYSDATETIME() > DateStart) as LOANS " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
        //wilson 01092024
        public async Task<IEnumerable<EmpAttRecordDetail>> GetLoanAppAsync(int EmpId, int LoanTitle, int DedId)
        {
            var dp = new DynamicParameters();
            string wc = " ";

            if (EmpId != '0')
            {
                //wc = wc + " EmpId = @EmpId";
                dp.Add("@EmpId", EmpId);
            }
            else
            {
                //wc = wc + " And (EmpId = @EmpId) ";
                dp.Add("@EmpId", '0');
            }

            if (LoanTitle != '0')
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@LoanTitle", LoanTitle);
            }
            else
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@LoanTitle", "0");
            }

            if (DedId != '0')
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@DedId", DedId);
            }
            else
            {
                //wc = wc + " And (AttRecId = @AttRecId) ";
                dp.Add("@DedId", "0");
            }

            string sort = " ";
            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>("select sum(LoanAmount) as SSSLoanCurrent,sum(MonthlyAmortization) as SSSLoanAdjustment,sum(EmpLoans) as SSSLoanAmount from (select CASE WHEN DeductionType = 1 THEN MonthlyAmortization/1 WHEN DeductionType = 2 THEN MonthlyAmortization/3  WHEN DeductionType = 3 THEN MonthlyAmortization/2 WHEN DeductionType = 4 THEN MonthlyAmortization/1 END as EmpLoans,* from appEmployeeLoans Where IsDeleted = 0 And(EmpId = @EmpId) and status = 'Active' and LoanTitle = @LoanTitle and SYSDATETIME() > DateStart and DeductionType IN (1, @DedId)) as LOANS " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        //wilson 02152024
        public async Task<IEnumerable<EmpAttRecordDetail>> Get201ListAsync(string filter, string sorting)
        {
            string[] tokens = filter.Split('|');
            string code = "";
            string name = "";
            string position = "";
            string company = "";
            string department = "";

            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    code = tokens[0].ToString();
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
                    position = tokens[2].ToString();
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[3].ToString() != "null")
                {
                    company = tokens[3].ToString();
                }
            }
            if (tokens.Length > 4)
            {
                if (tokens[4].ToString() != "null")
                {
                    department = tokens[4].ToString();
                }
            }
            var dp = new DynamicParameters();
            string wc = " ";
            if (code != "")
            {

                wc = wc + " and a.EmployeeCode like @code ";
                dp.Add("@code", "%"+ code + "%");
            }
            if (name != "")
            {

                wc = wc + " and a. LastName like @name or a.MiddleName like @name or a.MiddleName like @name ";
                dp.Add("@name", "%" + name + "%");
            }
            if (position != "")
            {

                wc = wc + " and c.name like @position ";
                dp.Add("@position", "%" + position + "%");
            }
            if (company != "")
            {

                wc = wc + " and e.name like @company ";
                dp.Add("@company", "%" + company + "%");
            }
            if (department != "")
            {

                wc = wc + " and d.name like @department ";
                dp.Add("@department", "%" + department + "%");
            }
            string sort = " ";

            try
            {
                IEnumerable<EmpAttRecordDetail> getAll = await _repositoryDapper.QueryAsync<EmpAttRecordDetail>(" select a.EmployeeCode as No,a. LastName +', '+ a.MiddleName as AttRecId,c.name as AttId,d.name as Days,e.name as [In],a.Bank as Out,a.BankNo as Late,b.PayrollRatePerMonth as BasicSalaryCurrent,b.PayrollRatePerDay as BasicSalaryAdjustment from AppEmployee as a left outer join (select * from appEmpSalaries where IsDeleted = 0) as b on a.Id = b.EmpId "
                                                    + "left outer join AppDepartment as c on a.DepartmentId = c.Id left outer join AppPosition as d on a.PositionId = d.id left outer join AppSectors as e on a.SectorsId = e.id where a.IsDeleted = 0 and a.StatusId = 1 " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }
    }
}
