using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Leads.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Dto;
using ezinvmvc.App.Leads.Exporting;
using ezinvmvc.App.Common;
using ezinvmvc.App.Clients;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees.Models;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Notification;
using Abp.Localization;
using Abp;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.App.Users.Dto;
using ezinvmvc.App.Notification.Models;
using System;

namespace ezinvmvc.App.Leads
{
    public class LeadService : ezinvmvcAppServiceBase, ILeadService
    {
        private readonly ILeadManager _manager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly IClientManager _clientManager;
        private readonly IAccountExecutiveManager _aeManager;
        private readonly ILeadExporter _exporter;
        //MARC LEEPE 11302022 notifications
        private readonly IEmployeeService _empService;
        private readonly INotificationManager _notifService;
        private readonly IUserNotificationManager _userNotifService;
        private readonly IStatusTypeManager _statusManager;

        public LeadService(ILeadManager manager, ISeriesTypeManager seriesTypeManager, IClientManager clientManager, IAccountExecutiveManager aeManager, ILeadExporter exporter, IEmployeeService empService, INotificationManager notifService, IUserNotificationManager userNotifService, IStatusTypeManager statusManager)
        {
            _manager = manager;
            _seriesTypeManager = seriesTypeManager;
            _clientManager = clientManager;
            _aeManager = aeManager;
            _exporter = exporter;
            //MARC LEEPE 11302022 notifications
            _notifService = notifService;
            _userNotifService = userNotifService;
            _empService = empService;
            _statusManager = statusManager;
        }

        public async Task<CreateLeadOutput> CreateLead(CreateLeadInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.Prefix = seriestype.Prefix;
            input.Code = seriescode;

            //Leads
            Lead output = Mapper.Map<Lead>(input);

            CheckErrors(await _manager.CreateAsync(output));
            //Leads

            //Account Executive
            CreateAccountExecutiveInput aeInput = new CreateAccountExecutiveInput();
            aeInput.Reference = "Lead";
            aeInput.ReferenceId = output.Id;
            aeInput.EmployeeId = output.AssignedToId;
            aeInput.AssignedDate = output.CreationTime;
            aeInput.IsActive = true;

            AccountExecutive ae = Mapper.Map<AccountExecutive>(aeInput);

            CheckErrors(await _aeManager.CreateAsync(ae));
            //Account Executive

            //return object
            CreateLeadOutput create = new CreateLeadOutput();
            create.Lead = Mapper.Map<GetLeadOutput>(output);
            create.Notif = new GetNotificationOutput();

            //MARC LEEPE 11302022
            #region notifications
            #region notif prototype
            //NotificationData nd = new NotificationData();
            //var data = new LocalizableMessageNotificationData(new LocalizableString("NewLead", "ezinvmvc"));
            //string leadCode = output.Code;
            //data["leadCode"] = leadCode;
            //GetEmployeeInput empInput = new GetEmployeeInput();
            //empInput.Id = output.AssignedToId;
            //var emp = await _empService.GetEmployee(empInput);
            //empInput.Id = emp.ManagerId;
            //emp = await _empService.GetEmployee(empInput);
            //UserIdentifier ui = new UserIdentifier(null, emp.UserId);
            //await _notificationPublisher.PublishAsync("NewLeadForApproval", data, userIds: new[] { ui });
            #endregion notif prototype
            #region notif v1
            //CreateNotificationInput nd = new CreateNotificationInput();
            //nd.Message = String.Format(L("NewLead"), output.Code);
            //nd.TransactionCode = output.Code;
            //nd.TransactionId = output.Id;
            //nd.Action = "Leads";
            //Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //CheckErrors(await _notifService.CreateAsync(ntf));
            //var getntf = await _notifService.GetByIdAsync(ntf.Id);

            ////manager notif
            //GetEmployeeInput empInput = new GetEmployeeInput();
            //CreateUserNotificationInput und = new CreateUserNotificationInput();
            //UserNotification untf = new UserNotification();
            //if (output.AssignedToId > 0)
            //{
            //    empInput.Id = output.AssignedToId;
            //    var emp = await _empService.GetEmployee(empInput);
            //    if (emp.ManagerId > 0)
            //    {
            //        empInput.Id = emp.ManagerId;
            //        var mngr = await _empService.GetEmployee(empInput);
            //        if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId)
            //        {
            //            und.NotificationId = ntf.Id;
            //            und.UserId = mngr.UserId;
            //            und.State = 0;
            //            und.CreationTime = DateTime.Now;
            //            getntf.UserIds = und.UserId.ToString();
            //            untf = Mapper.Map<UserNotification>(und);
            //            await _userNotifService.CreateAsync(untf);
            //        }
            //    }
            //}

            ////permission notif
            ////GetUsersOutput up = new GetUsersOutput();
            //GetUserNotificationsInput upi = new GetUserNotificationsInput();
            //upi.Filter = "CRM.Leads.Approve|CRM.Leads.AllAccounts";
            //var up = await _userNotifService.GetUsersByPermissionList(upi.Filter, "");
            //var upe = Mapper.Map<List<GetEmployeeOutput>>(up);
            //foreach (GetEmployeeOutput users in upe)
            //{
            //    string[] uids = getntf.UserIds.Split(',');
            //    if (users.UserId > 0 && users.UserId != (int)AbpSession.UserId && !uids.Contains(users.UserId.ToString()))
            //    {
            //        und = new CreateUserNotificationInput();
            //        und.NotificationId = ntf.Id;
            //        und.UserId = users.UserId;
            //        und.State = 0;
            //        und.CreationTime = DateTime.Now;
            //        untf = Mapper.Map<UserNotification>(und);
            //        await _userNotifService.CreateAsync(untf);
            //        getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? users.UserId.ToString() : "," + users.UserId.ToString();
            //    }
            //}
            #endregion notif v1

            List<long> userids = new List<long>();
            
            //get user ids first

            //manager notif
            GetEmployeeInput empInput = new GetEmployeeInput();
            if (output.AssignedToId > 0)
            {
                empInput.Id = output.AssignedToId;
                var emp = await _empService.GetEmployee(empInput);
                if (emp.ManagerId > 0)
                {
                    empInput.Id = emp.ManagerId;
                    var mngr = await _empService.GetEmployee(empInput);
                    if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId)
                    {
                        userids.Add(mngr.UserId);
                    }
                }
            }

            //permission notif
            //GetUsersOutput up = new GetUsersOutput();
            GetUserNotificationsInput upi = new GetUserNotificationsInput();
            upi.Filter = "CRM.Leads.Approve|CRM.Leads.AllAccounts";
            var up = await _userNotifService.GetUsersByPermissionList(upi.Filter, "");
            var upe = Mapper.Map<List<GetEmployeeOutput>>(up);
            foreach (GetEmployeeOutput users in upe)
            {
                if (users.UserId > 0 && users.UserId != (int)AbpSession.UserId && !userids.Contains(users.UserId))
                {
                    userids.Add(users.UserId);
                }
            }

            //check if there are users then create notification object and usernotif objects
            if(userids.Count() > 0)
            {
                CreateNotificationInput nd = new CreateNotificationInput();
                nd.Message = String.Format(L("NewLead"), output.Code);
                nd.TransactionCode = output.Code;
                nd.TransactionId = output.Id;
                nd.Action = "Leads";
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
                create.Notif = Mapper.Map<GetNotificationOutput>(getntf);
            }
            #endregion notifications

            await CurrentUnitOfWork.SaveChangesAsync();
            return create;
        }

        public async Task DeleteLead(DeleteLeadInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<GetLeadOutput> GetLead(GetLeadInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetLeadOutput>(getbyid);
        }

        public async Task<IEnumerable<GetLeadOutput>> GetLeadDetails(GetLeadInput input)
        {
            var getbyid = await _manager.GetLeadDetailsByIdAsync(input.Id);
            return Mapper.Map<List<GetLeadOutput>>(getbyid);
        }

        public async Task<PagedResultDto<GetLeadOutput>> GetLeads(GetLeadListInput input)
        {
            var resultList = await _manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetLeadOutput>(listcount, ObjectMapper.Map<List<GetLeadOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetLeadOutput>> GetLeadsforRFQ(GetLeadListInput input)
        {
            var resultList = await _manager.GetAllListforRFQ(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetLeadOutput>(listcount, ObjectMapper.Map<List<GetLeadOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetLeadOutput>> GetLeadsforRFQforEdit(GetLeadListInput input)
        {
            var resultList = await _manager.GetAllListforRFQforEdit(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetLeadOutput>(listcount, ObjectMapper.Map<List<GetLeadOutput>>(resultList));
        }

        public async Task<FileDto> GetLeadsToExcel(GetLeadListInput input)
        {
            var resultList = await _manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, true);
            var resultToExport = ObjectMapper.Map<List<GetLeadOutput>>(resultList);
            var result = _exporter.ExportToFile(resultToExport);
            return result;
        }

        public async Task<CreateLeadOutput> UpdateLead(UpdateLeadInput input)
        {
            Lead output = Mapper.Map<UpdateLeadInput, Lead>(input);
            if(input.StatusId == 2)
            {
                var updateclientstatus = await _clientManager.GetByIdAsync(int.Parse(input.ClientId));
                if (updateclientstatus.StatusId == 1)
                {
                    updateclientstatus.StatusId = 3;

                    CheckErrors(await _clientManager.UpdateAsync(updateclientstatus));
                }
            }
            CheckErrors(await _manager.UpdateAsync(output));
            
            GetLeadInput ldin = new GetLeadInput();
            ldin.Id = output.Id;
            var leadout = await GetLead(ldin);
            leadout.StatusId = output.StatusId;
            var statusType = await _statusManager.GetAllListFiltered(0, 104, output.StatusId);
            leadout.Status = statusType.FirstOrDefault().Status;

            CreateLeadOutput update = new CreateLeadOutput();
            update.Lead = Mapper.Map<GetLeadOutput>(leadout);
            //set to return 0 id for notification object
            update.Notif = new GetNotificationOutput();

            if (input.StatusId > 1)
            {
                #region notifications start
                #region notif v1
                //CreateNotificationInput nd = new CreateNotificationInput();
                //nd.Message = String.Format(L("UpdateLead"), leadout.Code, leadout.Status);
                //nd.TransactionCode = leadout.Code;
                //nd.TransactionId = leadout.Id;
                //nd.Action = "Leads";
                //Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                //CheckErrors(await _notifService.CreateAsync(ntf));
                //var getntf = await _notifService.GetByIdAsync(ntf.Id);

                ////ae notif
                //GetEmployeeInput empInput = new GetEmployeeInput();
                //if (leadout.UAssignedToId > 0)
                //{
                //    empInput.Id = leadout.UAssignedToId;
                //    var emp = await _empService.GetEmployee(empInput);
                //    CreateUserNotificationInput und = new CreateUserNotificationInput();
                //    if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                //    {
                //        und.NotificationId = ntf.Id;
                //        und.UserId = emp.UserId;
                //        und.State = 0;
                //        und.CreationTime = DateTime.Now;
                //        getntf.UserIds = und.UserId.ToString();
                //        UserNotification untf = Mapper.Map<UserNotification>(und);
                //        await _userNotifService.CreateAsync(untf);
                //    }
                //}
                #endregion notif v1

                //get user ids first
                List<long> userids = new List<long>();

                //ae notif
                GetEmployeeInput empInput = new GetEmployeeInput();
                if (leadout.UAssignedToId > 0)
                {
                    empInput.Id = leadout.UAssignedToId;
                    var emp = await _empService.GetEmployee(empInput);
                    CreateUserNotificationInput und = new CreateUserNotificationInput();
                    if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                    {
                        userids.Add(emp.UserId);
                    }
                    //manager notif
                    if (emp.ManagerId > 0)
                    {
                        empInput.Id = emp.ManagerId;
                        var mngr = await _empService.GetEmployee(empInput);
                        if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId && !userids.Contains(mngr.UserId))
                        {
                            userids.Add(mngr.UserId);
                        }
                    }
                }

                //check if there are users then create notification object and usernotif objects
                if (userids.Count() > 0)
                {
                    CreateNotificationInput nd = new CreateNotificationInput();
                    nd.Message = String.Format(L("UpdateLead"), leadout.Code, leadout.Status);
                    nd.TransactionCode = leadout.Code;
                    nd.TransactionId = leadout.Id;
                    nd.Action = "Leads";
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
                    update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                }
                #endregion notifications
            }
            await CurrentUnitOfWork.SaveChangesAsync();
            return update;
        }
    }
}
