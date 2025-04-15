using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.ContactPersons.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.ContactPersons
{
    public interface IContactPersonService : IApplicationService
    {
        Task<PagedResultDto<GetContactPersonOutput>> GetContactPersons();
        Task<PagedResultDto<GetContactPersonOutput>> GetContactPersonsFiltered(GetContactPersonListInput input);
        Task<int> CreateContactPerson(CreateContactPersonInput input);
        Task UpdateContactPerson(UpdateContactPersonInput input);
        Task DeleteContactPerson(DeleteContactPersonInput input);
        Task<GetContactPersonOutput> GetContactPerson(GetContactPersonInput input);
    }
}
