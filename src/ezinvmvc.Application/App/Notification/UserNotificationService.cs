using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Common;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.App.Notification.Models;
using ezinvmvc.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.App.Notification
{
    public class UserNotificationService : ezinvmvcAppServiceBase, IUserNotificationService
    {
        private readonly IUserNotificationManager _userNotificationManager;

        public UserNotificationService(IUserNotificationManager userNotificationManager)
        {
            _userNotificationManager = userNotificationManager;
        }

        public async Task CreateUserNotification(CreateUserNotificationInput input)
        {
            UserNotification orderoutput = Mapper.Map<UserNotification>(input);
            CheckErrors(await _userNotificationManager.CreateAsync(orderoutput));

            await CurrentUnitOfWork.SaveChangesAsync();
            
            //var getbyid = await _userNotificationManager.GetByIdAsync(orderoutput.Id);
            //return Mapper.Map<GetUserNotificationOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetUserNotificationOutput>> GetUserNotifications(GetUserNotificationsInput input)
        {
            var resultList = await _userNotificationManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetUserNotificationOutput>(listcount, ObjectMapper.Map<List<GetUserNotificationOutput>>(resultList));
        }

        public async Task<GetUserNotificationOutput> GetUserNotification(GetUserNotificationInput input)
        {
            var getbyid = await _userNotificationManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetUserNotificationOutput>(getbyid);
        }

        public async Task<GetUserNotificationOutput> UpdateUserNotification(UpdateUserNotificationInput input)
        {
            var returnint = 0;

            UserNotification updateparent = Mapper.Map<UserNotification>(input);
            CheckErrors(await _userNotificationManager.UpdateAsync(updateparent));
            returnint = updateparent.Id;

            await CurrentUnitOfWork.SaveChangesAsync();

            var getbyid = await _userNotificationManager.GetByIdAsync(updateparent.Id);
            return Mapper.Map<GetUserNotificationOutput>(getbyid);
        }

        public async Task<IEnumerable<GetEmployeeOutput>> GetUsersByPermission(GetUserNotificationsInput input)
        {
            var resultList = await _userNotificationManager.GetUsersByPermissionList(input.Filter, input.Sorting);

            return Mapper.Map<List<GetEmployeeOutput>>(resultList);
        }

        public async Task<PagedResultDto<GetUserNotificationOutput>> MarkAllRead(GetUserNotificationInput input)
        {
            var resultList = await _userNotificationManager.MarkAllRead(input.Id);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetUserNotificationOutput>(listcount, ObjectMapper.Map<List<GetUserNotificationOutput>>(resultList));
        }
    }
}
