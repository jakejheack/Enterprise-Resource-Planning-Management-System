using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Common;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.App.Notification
{
    public class NotificationService : ezinvmvcAppServiceBase, INotificationService
    {
        private readonly INotificationManager _notificationManager;

        public NotificationService(INotificationManager notificationManager)
        {
            _notificationManager = notificationManager;
        }

        public async Task CreateNotification(CreateNotificationInput input)
        {
            Models.Notification orderoutput = Mapper.Map<Models.Notification>(input);
            CheckErrors(await _notificationManager.CreateAsync(orderoutput));

            await CurrentUnitOfWork.SaveChangesAsync();

            //var getbyid = await _notificationManager.GetByIdAsync(orderoutput.Id);
            //var a = Mapper.Map<GetNotificationOutput>(getbyid);
            //return a;
        }

        public async Task<PagedResultDto<GetNotificationOutput>> GetNotifications(GetNotificationsInput input)
        {
            var resultList = await _notificationManager.GetAllList(input.Filter, input.Sorting);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetNotificationOutput>(listcount, ObjectMapper.Map<List<GetNotificationOutput>>(resultList));
        }

        public async Task<GetNotificationOutput> GetNotification(GetNotificationInput input)
        {
            var getbyid = await _notificationManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetNotificationOutput>(getbyid);
        }

        public async Task<GetNotificationOutput> UpdateNotification(UpdateNotificationInput input)
        {
            var returnint = 0;

            Models.Notification updateparent = Mapper.Map<Models.Notification>(input);
            CheckErrors(await _notificationManager.UpdateAsync(updateparent));
            returnint = updateparent.Id;
            
            await CurrentUnitOfWork.SaveChangesAsync();

            var getbyid = await _notificationManager.GetByIdAsync(updateparent.Id);
            return Mapper.Map<GetNotificationOutput>(getbyid);
        }
    }
}
