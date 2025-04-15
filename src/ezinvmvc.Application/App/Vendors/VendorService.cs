using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Vendors.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Dto;
using ezinvmvc.App.Vendors.Exporting;

namespace ezinvmvc.App.Vendors
{
    [AbpAuthorize(PermissionNames.Master_Vendors)]
    public class VendorService : ezinvmvcAppServiceBase, IVendorService
    {
        private readonly IVendorManager _manager;
        private readonly IVendorExporter _exporter;

        public VendorService(IVendorManager manager, IVendorExporter exporter)
        {
            _manager = manager;
            _exporter = exporter;
        }

        public async Task CreateVendor(CreateVendorInput input)
        {
            Vendor output = Mapper.Map<Vendor>(input);

            CheckErrors(await _manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteVendor(DeleteVendorInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<GetVendorOutput> GetVendor(GetVendorInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetVendorOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetVendorOutput>> GetVendors(GetVendorListInput input)
        {
            var resultList = await _manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetVendorOutput>(listcount, ObjectMapper.Map<List<GetVendorOutput>>(resultList));
        }

        public async Task<FileDto> GetVendorsToExcel(GetVendorListInput input)
        {
            var resultList = await _manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, true);
            var resultToExport = ObjectMapper.Map<List<GetVendorOutput>>(resultList);
            var result = _exporter.ExportToFile(resultToExport);
            return result;
        }

        public async Task UpdateVendor(UpdateVendorInput input)
        {
            Vendor output = Mapper.Map<UpdateVendorInput, Vendor>(input);
            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
