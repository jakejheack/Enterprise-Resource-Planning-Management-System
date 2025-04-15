using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.ContactPersons.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.ContactPersons
{
    public class ContactPersonService : ezinvmvcAppServiceBase, IContactPersonService
    {
        private readonly IContactPersonManager _manager;

        public ContactPersonService(IContactPersonManager manager)
        {
            _manager = manager;
        }
        public async Task<int> CreateContactPerson(CreateContactPersonInput input)
        {
            ContactPerson output = Mapper.Map<ContactPerson>(input);

            CheckErrors(await _manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }
        public async Task DeleteContactPerson(DeleteContactPersonInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }
        public async Task<GetContactPersonOutput> GetContactPerson(GetContactPersonInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetContactPersonOutput>(getbyid);
        }
        public async Task<PagedResultDto<GetContactPersonOutput>> GetContactPersons()
        {
            var resultList = await _manager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetContactPersonOutput>(listcount, ObjectMapper.Map<List<GetContactPersonOutput>>(resultList));
        }
        public async Task<PagedResultDto<GetContactPersonOutput>> GetContactPersonsFiltered(GetContactPersonListInput input)
        {
            var resultList = await _manager.GetAllListFiltered(input.Id, input.Reference, input.ReferenceId, input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, true);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetContactPersonOutput>(listcount, ObjectMapper.Map<List<GetContactPersonOutput>>(resultList));
        }
        public async Task UpdateContactPerson(UpdateContactPersonInput input)
        {
            ContactPerson output = Mapper.Map<UpdateContactPersonInput, ContactPerson>(input);

            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
