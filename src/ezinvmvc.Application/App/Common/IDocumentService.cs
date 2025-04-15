using Abp;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Common.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface IDocumentService : IApplicationService
    {
        Task<PagedResultDto<GetDocumentOutput>> GetDocuments();
        Task<PagedResultDto<GetDocumentOutput>> GetDocumentsFiltered(GetDocumentListInput input);
        Task<int> CreateDocument(CreateDocumentInput input);
        Task UpdateDocument(UpdateDocumentInput input);
        Task DeleteDocument(DeleteDocumentInput input);
        Task<GetDocumentOutput> GetDocument(GetDocumentInput input);
    }
}
