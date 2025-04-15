using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Common.Dto;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public class VATTypeService : ezinvmvcAppServiceBase, IVATTypeService
    {
        private readonly IVATTypeManager _vatTypeManager;
        private readonly ISeriesTypeManager _seriesTypeManager;

        public VATTypeService(IVATTypeManager vatTypeManager, ISeriesTypeManager seriesTypeManager)
        {
            _vatTypeManager = vatTypeManager;
            _seriesTypeManager = seriesTypeManager;
        }

        public async Task CreateVATType(CreateVATTypeInput input)
        {

            VATType output = Mapper.Map<VATType>(input);

            CheckErrors(await _vatTypeManager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteVATType(DeleteVATTypeInput input)
        {
            CheckErrors(await _vatTypeManager.DeleteAsync(input.Id));
        }

        public async Task<IEnumerable<GetVATTypeOutput>> GetVATTypes()
        {
            var getall = await _vatTypeManager.GetAllList();
            return Mapper.Map<List<GetVATTypeOutput>>(getall);
        }

        public async Task<GetVATTypeOutput> GetVATType(GetVATTypeInput input)
        {
            var getbyid = await _vatTypeManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetVATTypeOutput>(getbyid);
        }

        public async Task UpdateVATType(UpdateVATTypeInput input)
        {
            VATType output = Mapper.Map<UpdateVATTypeInput, VATType>(input);
            CheckErrors(await _vatTypeManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
