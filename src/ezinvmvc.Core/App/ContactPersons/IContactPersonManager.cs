using Abp.Domain.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.ContactPersons
{
    public interface IContactPersonManager : IDomainService
    {
        Task<IEnumerable<ContactPerson>> GetAllList();
        Task<IEnumerable<ContactPerson>> GetAllListFiltered(int id, string reference, int referenceId, string filter, string sorting, int offset, int fetch, bool forexport);
        Task<ContactPerson> GetByIdAsync(int id);
        Task<IdentityResult> CreateAsync(ContactPerson entity);
        Task<IdentityResult> UpdateAsync(ContactPerson entity);
        Task<IdentityResult> DeleteAsync(int id);
    }
}
