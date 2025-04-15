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

namespace ezinvmvc.App.Accounting
{
   public class JournalEntryItemManager : DomainService, IJournalEntryItemManager
    {
        private readonly IRepository<JournalEntryItem> _repository;
        private readonly IDapperRepository<JournalEntryItem> _repositoryDapper;

        public JournalEntryItemManager(IRepository<JournalEntryItem> repository, IDapperRepository<JournalEntryItem> repositoryDapper)
        {
            _repository = repository;
            _repositoryDapper = repositoryDapper;
        }

        public async Task<IdentityResult> CreateAsync(JournalEntryItem entity)
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

        public async Task<IEnumerable<JournalEntryItem>> GetAllByParentIdAsync(int parentid)
        {
            string wc = " Where a.JournalEntryId  = @parentid and a.Isdeleted = 0";

            string sort = " order by Id asc";

            var dp = new DynamicParameters();
            dp.Add("@parentid", parentid);
            try
            {
                var getAll = await _repositoryDapper.QueryAsync<JournalEntryItem>("select a.*, d.Name Accountname,  (case when b.name is null then '' else b.Name end) Name from AppJournalEntryItem as a inner join AppAccount as d on d.Id = a.AccountId left outer join (select id, code , 'Clients' PartyType, Name from appclients as clients union select id, employeecode code, 'Employees' PatyType, Employee.FirstName +' ' + Employee.MiddleName+' ' + Employee.LastName  Name from AppEmployee as Employee union select id, '' code, 'Vendors' PartyType, Name from AppVendors as vendors) as b on b.Id = a.PartyId and a.PartyType = b.PartyType " + wc + sort, dp);
                return getAll;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<JournalEntryItem> GetByIdAsync(int id)
        {
            string wc = " Where a.Id = @Id ";
            string sort = " Order By a.Id ";

            var dp = new DynamicParameters();
            dp.Add("@Id", id);
            try
            {
                var output = await _repositoryDapper.QueryAsync<JournalEntryItem>("select a.* from AppJournalEntryItem a  " + wc + sort, dp);
                return output.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Internal Error, " + ex.ToString());
            }
        }

        public async Task<IdentityResult> UpdateAsync(JournalEntryItem entity)
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
