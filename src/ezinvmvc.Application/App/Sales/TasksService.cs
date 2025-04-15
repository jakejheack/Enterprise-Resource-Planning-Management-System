using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Notification;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.App.Notification.Models;
using ezinvmvc.App.Sales.DTO;
using ezinvmvc.App.Sales.Models;

namespace ezinvmvc.App.Sales
{
    public class TasksService : ezinvmvcAppServiceBase, ITasksService
    {
        private readonly ITasksManager _tasksManager;
        //MARC LEEPE 01032023 notifications
        private readonly IEmployeeService _empService;
        private readonly INotificationManager _notifService;
        private readonly IUserNotificationManager _userNotifService;

        public TasksService(ITasksManager tasksManager
            //MARC LEEPE 01032023 notifications
            , IEmployeeService empService, INotificationManager notifService, IUserNotificationManager userNotifService)
        {
            _tasksManager = tasksManager;
            //MARC LEEPE 01032023 notifications
            _notifService = notifService;
            _userNotifService = userNotifService;
            _empService = empService;
        }

        public async Task<CreateTasksOutput> CreateTasks(CreateTasksInput input)
        {
            //input.ReferenceId = 3;
            //input.TransactionCode = "3";
            //input.ReferenceTransactionCode = "3";
            //input.Status = 0;
            Tasks tasksoutput = Mapper.Map<Tasks>(input.tasks);
            CheckErrors(await _tasksManager.CreateAsync(tasksoutput));

            //return object
            CreateTasksOutput create = new CreateTasksOutput();
            create.Tasks = Mapper.Map<TasksOutput>(tasksoutput);
            //set to return 0 length for notification object
            create.Notifs = new List<GetNotificationOutput>();

            //MARC LEEPE 01032023
            #region notifications

            #region notif v1
            //CreateNotificationInput nd = new CreateNotificationInput();
            //nd.Message = String.Format(L("NewTask"), tasksoutput.Code);
            //nd.TransactionCode = tasksoutput.Code;
            //nd.TransactionId = Convert.ToInt32(tasksoutput.TransactionCode);
            //nd.Action = "RFQ";
            //Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //CheckErrors(await _notifService.CreateAsync(ntf));
            //var getntf = await _notifService.GetByIdAsync(ntf.Id);
            //GetEmployeeInput empInput = new GetEmployeeInput();
            //empInput.Id = tasksoutput.EmployeeId;
            //if (empInput.Id > 0)
            //{
            //    var emp = await _empService.GetEmployee(empInput);
            //    CreateUserNotificationInput und = new CreateUserNotificationInput();
            //    UserNotification untf = new UserNotification();
            //    if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
            //    {
            //        und.NotificationId = ntf.Id;
            //        und.UserId = emp.UserId;
            //        und.State = 0;
            //        und.CreationTime = DateTime.Now;
            //        getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
            //        untf = Mapper.Map<UserNotification>(und);
            //        await _userNotifService.CreateAsync(untf);
            //    }
            //}
            #endregion notif v1

            //get user ids first
            List<long> userids = new List<long>();

            //assignee notif
            GetEmployeeInput empInput = new GetEmployeeInput();
            empInput.Id = tasksoutput.EmployeeId;
            if (empInput.Id > 0)
            {
                var emp = await _empService.GetEmployee(empInput);
                CreateUserNotificationInput und = new CreateUserNotificationInput();
                UserNotification untf = new UserNotification();
                if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                {
                    userids.Add(emp.UserId);
                }
            }

            //check if there are users then create notification object and usernotif objects
            if (userids.Count() > 0)
            {
                CreateNotificationInput nd = new CreateNotificationInput();
                nd.Message = String.Format(L("NewTask"), tasksoutput.Code);
                nd.TransactionCode = tasksoutput.Code;
                nd.TransactionId = Convert.ToInt32(tasksoutput.TransactionCode);
                nd.Action = "RFQ";
                Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                CheckErrors(await _notifService.CreateAsync(ntf));
                var getntf = await _notifService.GetByIdAsync(ntf.Id);

                CreateUserNotificationInput und = new CreateUserNotificationInput();
                UserNotification untf = new UserNotification();
                foreach (long userid in userids)
                {
                    und = new CreateUserNotificationInput();
                    und.NotificationId = ntf.Id;
                    und.UserId = userid;
                    und.State = 0;
                    und.CreationTime = DateTime.Now;
                    untf = Mapper.Map<UserNotification>(und);
                    await _userNotifService.CreateAsync(untf);
                    getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? userid.ToString() : "," + userid.ToString();
                }

                //set return notif to created notif object
                create.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
            }
            #endregion notifications

            await CurrentUnitOfWork.SaveChangesAsync();
            //return tasksoutput.Id;
            return create;
        }

        public async Task<PagedResultDto<GetTasksOutput>> GetTaskByParentId(GetTasksInput input)
        {
            var resultList = await _tasksManager.GetAllByParentIdAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<GetTasksOutput>(listcount, ObjectMapper.Map<List<GetTasksOutput>>(resultList));
        }

        public async Task<GetTasksOutput> GetTasks(GetTasksInput input)
        {
            var getbyid = await _tasksManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetTasksOutput>(getbyid);

        }

        public async Task<PagedResultDto<TasksOutput>> GetTasksall(GetTasksListInput input)
        {
            var resultList = await _tasksManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<TasksOutput>(listcount, ObjectMapper.Map<List<TasksOutput>>(resultList));
        }

        public async Task<CreateTasksOutput> UpdateTasks(UpdateTasksInput input)
        {
            Tasks output = Mapper.Map<Tasks>(input.tasks);
            var getbyid = await _tasksManager.GetByIdAsync(Convert.ToInt32(input.tasks.TransactionCode));
            CheckErrors(await _tasksManager.UpdateAsync(output));

            CreateTasksOutput update = new CreateTasksOutput();
            update.Tasks = Mapper.Map<TasksOutput>(output);
            //set to return 0 length for notification object
            update.Notifs = new List<GetNotificationOutput>();

            //MARC LEEPE 01032023
            #region notifications

            #region notif v1
            //CreateNotificationInput nd = new CreateNotificationInput();
            //nd.Message = String.Format(L("UpdateTask"), output.Code);
            //nd.TransactionCode = output.Code;
            //nd.TransactionId = Convert.ToInt32(output.TransactionCode);
            //nd.Action = "RFQ";
            //Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //CheckErrors(await _notifService.CreateAsync(ntf));
            //var getntf = await _notifService.GetByIdAsync(ntf.Id);
            //GetEmployeeInput empInput = new GetEmployeeInput();
            //empInput.Id = output.EmployeeId;
            //if (empInput.Id > 0)
            //{
            //    var emp = await _empService.GetEmployee(empInput);
            //    CreateUserNotificationInput und = new CreateUserNotificationInput();
            //    UserNotification untf = new UserNotification();
            //    if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
            //    {
            //        und.NotificationId = ntf.Id;
            //        und.UserId = emp.UserId;
            //        und.State = 0;
            //        und.CreationTime = DateTime.Now;
            //        getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
            //        untf = Mapper.Map<UserNotification>(und);
            //        await _userNotifService.CreateAsync(untf);
            //    }
            //    update.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
            //}
            //if (getbyid != null)
            //{
            //    if (empInput.Id != getbyid.EmployeeId)
            //    {
            //        nd = new CreateNotificationInput();
            //        nd.Message = String.Format(L("RemoveTask"), output.Code);
            //        nd.TransactionCode = output.Code;
            //        nd.TransactionId = Convert.ToInt32(output.TransactionCode);
            //        nd.Action = "RFQ";
            //        ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //        CheckErrors(await _notifService.CreateAsync(ntf));
            //        getntf = await _notifService.GetByIdAsync(ntf.Id);
            //        empInput.Id = getbyid.EmployeeId;
            //        if (empInput.Id > 0)
            //        {
            //            var emp = await _empService.GetEmployee(empInput);
            //            CreateUserNotificationInput und = new CreateUserNotificationInput();
            //            UserNotification untf = new UserNotification();
            //            //string[] uids = getntf.UserIds.Split(',');
            //            if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId) //&& !uids.Contains(emp.UserId.ToString()))
            //            {
            //                und.NotificationId = ntf.Id;
            //                und.UserId = emp.UserId;
            //                und.State = 0;
            //                und.CreationTime = DateTime.Now;
            //                getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
            //                untf = Mapper.Map<UserNotification>(und);
            //                await _userNotifService.CreateAsync(untf);
            //            }
            //        }
            //        update.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
            //    }
            //}
            #endregion notif v1
            
            //get user ids first
            List<long> userids = new List<long>();

            //assignee notif
            GetEmployeeInput empInput = new GetEmployeeInput();
            empInput.Id = output.EmployeeId;
            if (empInput.Id > 0)
            {
                var emp = await _empService.GetEmployee(empInput);
                CreateUserNotificationInput und = new CreateUserNotificationInput();
                UserNotification untf = new UserNotification();
                if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                {
                    userids.Add(emp.UserId);
                }
            }

            //check if there are users then create notification object and usernotif objects
            if (userids.Count() > 0)
            {
                CreateNotificationInput nd = new CreateNotificationInput();
                nd.Message = String.Format(L("UpdateTask"), output.Code);
                nd.TransactionCode = output.Code;
                nd.TransactionId = Convert.ToInt32(output.TransactionCode);
                nd.Action = "RFQ";
                Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                CheckErrors(await _notifService.CreateAsync(ntf));
                var getntf = await _notifService.GetByIdAsync(ntf.Id);

                CreateUserNotificationInput und = new CreateUserNotificationInput();
                UserNotification untf = new UserNotification();
                foreach (long userid in userids)
                {
                    und = new CreateUserNotificationInput();
                    und.NotificationId = ntf.Id;
                    und.UserId = userid;
                    und.State = 0;
                    und.CreationTime = DateTime.Now;
                    untf = Mapper.Map<UserNotification>(und);
                    await _userNotifService.CreateAsync(untf);
                    getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? userid.ToString() : "," + userid.ToString();
                }

                //set return notif to created notif object
                update.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
            }

            if (getbyid != null)
            {
                userids = new List<long>();
                //removed assignee notif
                if (empInput.Id != getbyid.EmployeeId)
                {
                    empInput = new GetEmployeeInput();
                    empInput.Id = getbyid.EmployeeId;
                    if (empInput.Id > 0)
                    {
                        var emp = await _empService.GetEmployee(empInput);
                        if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                        {
                            userids.Add(emp.UserId);
                        }
                    }

                    if (userids.Count() > 0)
                    {
                        CreateNotificationInput nd = new CreateNotificationInput();
                        nd.Message = String.Format(L("RemoveTask"), output.Code);
                        nd.TransactionCode = output.Code;
                        nd.TransactionId = Convert.ToInt32(output.TransactionCode);
                        nd.Action = "RFQ";
                        Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                        CheckErrors(await _notifService.CreateAsync(ntf));
                        var getntf = await _notifService.GetByIdAsync(ntf.Id);

                        CreateUserNotificationInput und = new CreateUserNotificationInput();
                        UserNotification untf = new UserNotification();
                        foreach (long userid in userids)
                        {
                            und = new CreateUserNotificationInput();
                            und.NotificationId = ntf.Id;
                            und.UserId = userid;
                            und.State = 0;
                            und.CreationTime = DateTime.Now;
                            untf = Mapper.Map<UserNotification>(und);
                            await _userNotifService.CreateAsync(untf);
                            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? userid.ToString() : "," + userid.ToString();
                        }

                        //set return notif to created notif object
                        update.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
                    }
                }
            }
            #endregion notifications

            await CurrentUnitOfWork.SaveChangesAsync();
            //return output.Id;
            return update;
        }
    }
}
