using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Leads.Dto;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public class LeadTaskService : ezinvmvcAppServiceBase, ILeadTaskService
    {
        private readonly ILeadTaskManager _leadTaskManager;

        public LeadTaskService(ILeadTaskManager leadTaskManager)
        {
            _leadTaskManager = leadTaskManager;
        }

        public async Task CreateLeadTask(CreateLeadTaskInput input)
        {
            LeadTask output = Mapper.Map<LeadTask>(input);

            CheckErrors(await _leadTaskManager.CreateAsync(output));

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteLeadTask(DeleteLeadTaskInput input)
        {
            CheckErrors(await _leadTaskManager.DeleteAsync(input.Id));
        }

        public async Task<IEnumerable<GetLeadTaskOutput>> GetLeadTasks()
        {
            var getall = await _leadTaskManager.GetAllList();
            return Mapper.Map<List<GetLeadTaskOutput>>(getall);
        }

        public async Task<GetLeadTaskOutput> GetLeadTask(GetLeadTaskInput input)
        {
            var getbyid = await _leadTaskManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetLeadTaskOutput>(getbyid);
        }

        public async Task UpdateLeadTask(UpdateLeadTaskInput input)
        {
            LeadTask output = Mapper.Map<UpdateLeadTaskInput, LeadTask>(input);
            CheckErrors(await _leadTaskManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
