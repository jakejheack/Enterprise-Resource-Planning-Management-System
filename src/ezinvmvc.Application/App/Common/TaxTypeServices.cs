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
    public class TaxTypeServices : ezinvmvcAppServiceBase, ITaxTypeServices
    {
        private readonly ITaxTypeManager _taxTypeManager;
        private readonly ISeriesTypeManager _seriesTypeManager;

        public TaxTypeServices(ITaxTypeManager taxTypeManager, ISeriesTypeManager seriesTypeManager)
        {
            _taxTypeManager = taxTypeManager;
            _seriesTypeManager = seriesTypeManager;
        }

        public async Task CreateTaxtType(CreateTaxTypeInput input)
        {
            TaxType output = Mapper.Map<TaxType>(input);

            CheckErrors(await _taxTypeManager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteTaxtType(DeleteTaxTypeInput input)
        {
            CheckErrors(await _taxTypeManager.DeleteAsync(input.Id));
        }

        public async Task<GetTaxTypeOutput> GetTaxtType(GetTaxTypeInput input)
        {
            var getbyid = await _taxTypeManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetTaxTypeOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetTaxTypeOutput>> GetTaxtTypelist()
        {
            var resultList = await _taxTypeManager.GetAllList();
            int listcount = resultList.Count();
            return new PagedResultDto<GetTaxTypeOutput>(listcount, ObjectMapper.Map<List<GetTaxTypeOutput>>(resultList));
        }

        public async Task<IEnumerable<GetTaxTypeOutput>> GetTaxtTypes()
        {
            var getall = await _taxTypeManager.GetAllList();
            return Mapper.Map<List<GetTaxTypeOutput>>(getall);
        }

        public async Task UpdateTaxtType(UpdateTaxTypeInput input)
        {
            TaxType output = Mapper.Map<TaxType>(input.taxtype);
            CheckErrors(await _taxTypeManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
