using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Dapper;
using ezinvmvc.App.Sales.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public class TasksManager : DomainService, ITasksManager
    {
        private readonly IRepository<Tasks> _repository;
        private readonly IDapperRepository<Tasks> _repositoryDapper;


        public TasksManager(IRepository<Tasks> repository, IDapperRepository<Tasks> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(Tasks entity)
        {
            var result = _repository.FirstOrDefault(x => x.Id == entity.Id);
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

        public async Task<IEnumerable<Tasks>> GetAllByParentIdAsync(int parentid)
        {
            string wc = " Where v.TransactionCode = @Id";

            string sort = " order by Id asc";

            var dp = new DynamicParameters();
            dp.Add("@Id", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Tasks>("select count(*) over() Totalrows, v.* FROM AppTasks v " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IEnumerable<Tasks>> GetAllList(string filter, string sorting, int offset, int fetch, bool forexport)
        {
            //string wc = " Where v.isdeleted = 0 and v.status = 0";
            //if (filter != null && filter.Trim() != "")
            //{
            //    wc = wc + " And (a.code like @Filter) ";
            //}
            //string sort = "";
            //if (sorting.Trim().Length > 0)
            //{
            //    var firstWord = sorting.Split(' ').First();
            //    var lastWord = sorting.Split(' ').Last();
            //    var firstlupper = firstWord.First().ToString().ToUpper();
            //    var finalfield = firstlupper + firstWord.Substring(1);
            //    sort = " order by " + finalfield + " " + lastWord;
            //    //sort = " order by a.Projectname asc ";
            //}
            //else
            //{
            //    sort = " order by v.Id asc ";
            //}
            //var dp = new DynamicParameters();
            //dp.Add("@Filter", "%" + filter + "%");

            string[] tokens = filter.Split('|');

            string tfilter = "", code = "", datefrom = "", dateto = "";
            if (tokens.Length > 0)
            {
                if (tokens[0].ToString() != "null")
                {
                    tfilter = tokens[0];
                }
            }
            else
            {
                tfilter = filter;
            }
            if (tokens.Length > 1)
            {
                if (tokens[1].ToString() != "null")
                {
                    code = tokens[1];
                }
            }
            if (tokens.Length > 3)
            {
                if (tokens[2].ToString() != "null" && tokens[3].ToString() != "null")
                {
                    datefrom = tokens[2];
                    dateto = tokens[3];
                }
            }

            string wc = "Where v.isdeleted = 0";
            var dp = new DynamicParameters();

            if (tfilter != null && tfilter.Trim() != "" & tfilter.Trim() != "null")
            {
                wc = wc + " And ((a.Code like @Filter) or (v.name like @Filter) or (c.code like @Filter) ) ";
                dp.Add("@Filter", "%" + tfilter + "%");
            }
            //if (code != null && code.Trim() != "" && code.Trim() != "null")
            //{
            //    wc = wc + " And a.Code = @code ";
            //    dp.Add("@code", code);
            //}
            if (datefrom != null && datefrom.Trim() != "" && dateto != null && dateto.Trim() != null && dateto != "null" && dateto.Trim() != "null")
            {
                wc = wc + " And v.CreationTime between @datefrom and @dateto ";
                dp.Add("@datefrom", Convert.ToDateTime(datefrom).ToString("MM/dd/yyyy") + " 00:00:00");
                dp.Add("@dateto", Convert.ToDateTime(dateto).ToString("MM/dd/yyyy") + " 23:59:59");
            }
            string sort = "";
            if (sorting.Trim().Length > 0)
            {
                var firstWord = sorting.Split(' ').First();
                var lastWord = sorting.Split(' ').Last();
                var firstlupper = firstWord.First().ToString().ToUpper();
                var finalfield = firstlupper + firstWord.Substring(1);
                sort = " order by " + finalfield + " " + lastWord;
                //sort = " order by a.Projectname asc ";
            }
            else
            {
                sort = " order by v.Id asc ";
            }
            try
            {
                if (!forexport)
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Tasks>("select count(*) over() Totalrows, v.* FROM AppTasks v " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryDapper.QueryAsync<Tasks>("select count(*) over() Totalrows, a.Id as RFQID, a.Code, a.RevisionNo, b.StatusId, b.Status as AssignStatus,v.* FROM AppTasks v left outer join appRFq as a on a.Id = v.TransactionCode left outer join AppAssignStatusTypes as b on v.Status = b.StatusId " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    //var getAll = await _repositoryDapper.QueryAsync<Tasks>("select count(*) over() Totalrows, a.Id as RFQID, a.Code , a.RevisionNo, (case when c.id is null then '' else c.Id end) as SoId,  (case when c.Code is null then '' else c.Code end) as SoCode, (case when c.RevisionNo is null then '' else c.RevisionNo end) as SoRevNO, b.StatusId, b.status as AssignStatus,v.* FROM AppTasks v left outer join appRFq as a on a.Id = v.TransactionCode left outer join AppAssignStatusTypes as b on v.Status = b.StatusId left outer join AppQuotations as c on c.RequestId = v.TransactionCode " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    var getAll = await _repositoryDapper.QueryAsync<Tasks>("select count(*) over() Totalrows, a.Id as RFQID, a.Code , a.RevisionNo, isnull(c.id, '') as SoId,  isnull(c.code, '') as SoCode, isnull(c.RevisionNo, '') as SoRevNO, b.StatusId, b.status as AssignStatus,v.* FROM AppTasks v left outer join appRFq as a with(nolock) on a.Id = v.TransactionCode left outer join AppAssignStatusTypes as b with(nolock) on v.Status = b.StatusId left outer join AppQuotations as c with(nolock) on c.RequestId = v.TransactionCode " + wc + sort + " OFFSET " + offset + " ROWS FETCH NEXT " + fetch + " ROWS ONLY ", dp);
                    return getAll;
                }
                else
                {
                    //var getAll = await _repositoryDapper.QueryAsync<Tasks>("select count(*) over() Totalrows, a.Id as RFQID, a.Code , a.RevisionNo, (case when c.id is null then '' else c.Id end) as SoId,  (case when c.Code is null then '' else c.Code end) as SoCode, (case when c.RevisionNo is null then '' else c.RevisionNo end) as SoRevNO, b.StatusId, b.status as AssignStatus,v.* FROM AppTasks v left outer join appRFq as a on a.Id = v.TransactionCode left outer join AppAssignStatusTypes as b on v.Status = b.StatusId left outer join AppQuotations as c on c.RequestId = v.TransactionCode " + wc + sort, dp);
                    var getAll = await _repositoryDapper.QueryAsync<Tasks>("select count(*) over() Totalrows, a.Id as RFQID, a.Code , a.RevisionNo, isnull(c.id, '') as SoId,  isnull(c.code, '') as SoCode, isnull(c.RevisionNo, '') as SoRevNO, b.StatusId, b.status as AssignStatus,v.* FROM AppTasks v left outer join appRFq as a with(nolock) on a.Id = v.TransactionCode left outer join AppAssignStatusTypes as b with(nolock) on v.Status = b.StatusId left outer join AppQuotations as c with(nolock) on c.RequestId = v.TransactionCode " + wc + sort, dp);
                    return getAll;
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<Tasks> GetByIdAsync(int id)
        {
            string wc = " Where a.TransactionCode = @Id and a.status = 0 ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<Tasks>("select count(*) over() Totalrows, a.* FROM AppTasks a " + wc, dp);

                return getAll.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(Tasks entity)
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
