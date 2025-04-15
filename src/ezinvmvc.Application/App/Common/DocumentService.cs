using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Common.Dto;

namespace ezinvmvc.App.Common
{
    public class DocumentService : ezinvmvcAppServiceBase, IDocumentService
    {
        private readonly IDocumentManager _manager;

        public DocumentService(IDocumentManager manager)
        {
            _manager = manager;
        }

        public async Task<int> CreateDocument(CreateDocumentInput input)
        {
            Documents output = Mapper.Map<Documents>(input);

            CheckErrors(await _manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteDocument(DeleteDocumentInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<GetDocumentOutput> GetDocument(GetDocumentInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetDocumentOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetDocumentOutput>> GetDocuments()
        {
            var resultList = await _manager.GetAllList();
            int listcount = 0;
            return new PagedResultDto<GetDocumentOutput>(listcount, ObjectMapper.Map<List<GetDocumentOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetDocumentOutput>> GetDocumentsFiltered(GetDocumentListInput input)
        {
            var resultList = await _manager.GetAllListFiltered(input.Id, input.Reference, input.ReferenceId, input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, true);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetDocumentOutput>(listcount, ObjectMapper.Map<List<GetDocumentOutput>>(resultList));
        }

        public async Task UpdateDocument(UpdateDocumentInput input)
        {
            Documents output = Mapper.Map<UpdateDocumentInput, Documents>(input);

            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
