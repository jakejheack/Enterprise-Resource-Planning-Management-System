using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Products.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.App.Common.Dto;

namespace ezinvmvc.App.Common
{
    public class CompanyService : ezinvmvcAppServiceBase, ICompanyService
    {
        private readonly ICompanyManager _manager;

        public CompanyService(ICompanyManager manager)
        {
            _manager = manager;
        }
        public async Task CreateCompany(CreateCompanyInput input)
        {
            Company output = Mapper.Map<Company>(input);

            CheckErrors(await _manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteCompany(DeleteCompanyInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetCompanyOutput>> GetCompanies()
        {
            var resultList = await _manager.GetAllList();
            int listcount = resultList.Count();
            return new PagedResultDto<GetCompanyOutput>(listcount, ObjectMapper.Map<List<GetCompanyOutput>>(resultList));
        }

        public async Task<GetCompanyOutput> GetCompany(GetCompanyInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetCompanyOutput>(getbyid);
        }

        public async Task UpdateCompany(UpdateCompanyInput input)
        {
            Company output = Mapper.Map<Company>(input.company);
           
            //Company output = Mapper.Map<UpdateCompanyInput, Company>(input);
            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
