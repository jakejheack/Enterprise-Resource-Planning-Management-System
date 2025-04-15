using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    public interface ITasksService : IApplicationService
    {
        Task<GetTasksOutput> GetTasks(GetTasksInput input);
        Task<PagedResultDto<TasksOutput>> GetTasksall(GetTasksListInput input);
        //Task<PagedResultDto<TasksOutput>> GetTasksfor(GetTasksListInput input);
        Task<CreateTasksOutput> CreateTasks(CreateTasksInput input);
        Task<CreateTasksOutput> UpdateTasks(UpdateTasksInput input);
        Task<PagedResultDto<GetTasksOutput>> GetTaskByParentId(GetTasksInput input);

    }
}
