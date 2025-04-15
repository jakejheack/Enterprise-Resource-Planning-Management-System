using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Contribution;
using ezinvmvc.App.Contributions.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Contributions
{
    public class EmpContributionService : ezinvmvcAppServiceBase, IEmpContributionService
    {
        private readonly IEmpContributionManager _Manager;

        public EmpContributionService(IEmpContributionManager empContributionManager)
        {
            _Manager = empContributionManager;
        }

        public async Task CreateEmpContributionAsync(CreateEmpContributionInput input)
        {
            EmpContribution output = Mapper.Map<EmpContribution>(input);

            CheckErrors(await _Manager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmpContributionAsync(DeleteEmpContributionInput input)
        {
            CheckErrors(await _Manager.DeleteAsync(input.Id));
        }

        public async Task<PagedResultDto<GetEmpContributionOutput>> GetAllEmpContributionAsync(GetEmpContributionListInput input)
        {
            var resultList = await _Manager.GetAllAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpContributionOutput>(listcount, ObjectMapper.Map<List<GetEmpContributionOutput>>(resultList));
        }

        public async Task<GetEmpContributionOutput> GetDetailEmpContributionsAsync(GetEmpContributionInput input)
        {
            var getbyid = await _Manager.GetDetailAsync(input.EmpId);
            return Mapper.Map<GetEmpContributionOutput>(getbyid);
        }

        public async Task<GetEmpContributionOutput> GetEmpContributionByIdAsync(GetEmpContributionInput input)
        {
            var getbyid = await _Manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetEmpContributionOutput>(getbyid);
        }

        public async Task UpdateEmpContributionAsync(UpdateEmpContributionInput input)
        {
            EmpContribution output = Mapper.Map<UpdateEmpContributionInput, EmpContribution>(input);
            CheckErrors(await _Manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<PagedResultDto<GetEmpContributionOutput>> GetEmpContributionAsync(GetEmpContributionListInput input)
        {
            var resultList = await _Manager.GetEmpContributionAsync(input.Filter);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpContributionOutput>(listcount, ObjectMapper.Map<List<GetEmpContributionOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetEmpContributionOutput>> GetPremiumDeductionAsync(GetEmpContributionListInput input)
        {
            var resultList = await _Manager.GetPremiumDeductionListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetEmpContributionOutput>(listcount, ObjectMapper.Map<List<GetEmpContributionOutput>>(resultList));
        }

    }
}
