using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees.Models;
using ezinvmvc.App.Leads.Dto;
using ezinvmvc.App.Leads.Exporter;
using ezinvmvc.App.Notification;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.App.Notification.Models;
using ezinvmvc.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Leads
{
    public class LeadUpdateService : ezinvmvcAppServiceBase, ILeadUpdateService
    {
        private readonly ILeadUpdateManager _manager;
        private readonly IAccountExecutiveManager _aeManager;
        private readonly ILeadUpdateExporter _exporter;
        //MARC LEEPE 01032023 notifications
        private readonly IEmployeeService _empService;
        private readonly INotificationManager _notifService;
        private readonly IUserNotificationManager _userNotifService;

        public LeadUpdateService(ILeadUpdateManager manager, IAccountExecutiveManager aeManager, ILeadUpdateExporter exporter
            //MARC LEEPE 01032023 notifications
            , IEmployeeService empService, INotificationManager notifService, IUserNotificationManager userNotifService)
        {
            _manager = manager;
            _aeManager = aeManager;
            _exporter = exporter;
            //MARC LEEPE 01032023 notifications
            _notifService = notifService;
            _userNotifService = userNotifService;
            _empService = empService;
        }

        public async Task<CreateLeadUpdateOutput> CreateLeadUpdate(CreateLeadUpdateInput input)
        {
            //input.LeadUpdateDate = Convert.ToDateTime(Convert.ToDateTime(input.LeadUpdateDate.ToString()).ToString("MM/dd/yyyy") + " " + System.DateTime.Now.ToString("hh:mm tt"));
            LeadUpdate output = Mapper.Map<LeadUpdate>(input);

            CheckErrors(await _manager.CreateAsync(output));

            //AccountExecutive
            var oldAE = await _aeManager.GetByReferenceIdAsync(output.LeadId, "Lead");
            if (oldAE == null)
            {
                CreateAccountExecutiveInput aeInput = new CreateAccountExecutiveInput();
                aeInput.Reference = "Lead";
                aeInput.ReferenceId = output.LeadId;
                aeInput.EmployeeId = output.AssignedToId;
                aeInput.AssignedDate = System.DateTime.Now;
                aeInput.IsActive = true;

                AccountExecutive ae = Mapper.Map<AccountExecutive>(aeInput);

                CheckErrors(await _aeManager.CreateAsync(ae));
            }
            else if (oldAE.EmployeeId != output.AssignedToId)
            {
                oldAE.IsActive = false;

                AccountExecutive updateoldae = Mapper.Map<AccountExecutive>(oldAE);

                CheckErrors(await _aeManager.UpdateAsync(updateoldae));

                CreateAccountExecutiveInput aeInput = new CreateAccountExecutiveInput();
                aeInput.Reference = "Lead";
                aeInput.ReferenceId = output.LeadId;
                aeInput.EmployeeId = output.AssignedToId;
                aeInput.AssignedDate = output.CreationTime;
                aeInput.IsActive = true;

                AccountExecutive ae = Mapper.Map<AccountExecutive>(aeInput);

                CheckErrors(await _aeManager.CreateAsync(ae));
            }
            else
            {
                //oldAddress.AddressDescription = input.Address;

                AccountExecutive updateae = Mapper.Map<AccountExecutive>(oldAE);

                CheckErrors(await _aeManager.UpdateAsync(updateae));
            }
            //AccountExecutive

            await CurrentUnitOfWork.SaveChangesAsync();

            CreateLeadUpdateOutput create = new CreateLeadUpdateOutput();
            create.LeadUpdate = Mapper.Map<GetLeadUpdateOutput>(output);
            create.Notifs = new List<GetNotificationOutput>();

            //MARC LEEPE 01032023
            #region notifications

            #region notif v1
            //CreateNotificationInput nd = new CreateNotificationInput();
            //nd.Message = String.Format(L("NewLeadUpdate"), output.LeadCode);
            //nd.TransactionCode = output.LeadCode;
            //nd.TransactionId = Convert.ToInt32(output.LeadId);
            //nd.Action = "Leads2";
            //Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //CheckErrors(await _notifService.CreateAsync(ntf));
            //var getntf = await _notifService.GetByIdAsync(ntf.Id);
            //GetEmployeeInput empInput = new GetEmployeeInput();
            //empInput.Id = output.AssignedToId;
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
            //    if (emp.ManagerId > 0)
            //    {
            //        empInput.Id = emp.ManagerId;
            //        var mngr = await _empService.GetEmployee(empInput);
            //        string[] uids = getntf.UserIds.Split(',');
            //        if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId && !uids.Contains(mngr.UserId.ToString()))
            //        {
            //            //manager notif
            //            und = new CreateUserNotificationInput();
            //            und.NotificationId = ntf.Id;
            //            und.UserId = mngr.UserId;
            //            und.State = 0;
            //            und.CreationTime = DateTime.Now;
            //            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
            //            untf = Mapper.Map<UserNotification>(und);
            //            await _userNotifService.CreateAsync(untf);
            //        }
            //    }
            //    create.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
            //}
            //if (oldAE.EmployeeId != output.AssignedToId)
            //{
            //    //new
            //    nd = new CreateNotificationInput();
            //    nd.Message = String.Format(L("AssignLeadUpdate"), output.LeadCode);
            //    nd.TransactionCode = output.LeadCode;
            //    nd.TransactionId = Convert.ToInt32(output.LeadId);
            //    nd.Action = "Leads2";
            //    ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //    CheckErrors(await _notifService.CreateAsync(ntf));
            //    getntf = await _notifService.GetByIdAsync(ntf.Id);
            //    empInput = new GetEmployeeInput();
            //    empInput.Id = output.AssignedToId;
            //    if (empInput.Id > 0)
            //    {
            //        var emp = await _empService.GetEmployee(empInput);
            //        CreateUserNotificationInput und = new CreateUserNotificationInput();
            //        UserNotification untf = new UserNotification();
            //        if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
            //        {
            //            und.NotificationId = ntf.Id;
            //            und.UserId = emp.UserId;
            //            und.State = 0;
            //            und.CreationTime = DateTime.Now;
            //            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
            //            untf = Mapper.Map<UserNotification>(und);
            //            await _userNotifService.CreateAsync(untf);
            //        }
            //        create.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
            //    }

            //    //old
            //    nd = new CreateNotificationInput();
            //    nd.Message = String.Format(L("RemoveLeadUpdate"), output.LeadCode);
            //    nd.TransactionCode = output.LeadCode;
            //    nd.TransactionId = Convert.ToInt32(output.LeadId);
            //    nd.Action = "Leads2";
            //    ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //    CheckErrors(await _notifService.CreateAsync(ntf));
            //    getntf = await _notifService.GetByIdAsync(ntf.Id);
            //    empInput = new GetEmployeeInput();
            //    empInput.Id = oldAE.EmployeeId;
            //    if (empInput.Id > 0)
            //    {
            //        var emp = await _empService.GetEmployee(empInput);
            //        CreateUserNotificationInput und = new CreateUserNotificationInput();
            //        UserNotification untf = new UserNotification();
            //        if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
            //        {
            //            und.NotificationId = ntf.Id;
            //            und.UserId = emp.UserId;
            //            und.State = 0;
            //            und.CreationTime = DateTime.Now;
            //            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
            //            untf = Mapper.Map<UserNotification>(und);
            //            await _userNotifService.CreateAsync(untf);
            //        }
            //        create.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
            //    }
            //}
            #endregion  notif v1
            
            //get user ids first
            List<long> userids = new List<long>();

            if (oldAE.EmployeeId != output.AssignedToId)
            {
                //new
                userids = new List<long>();
                GetEmployeeInput empInput = new GetEmployeeInput();
                empInput.Id = output.AssignedToId;
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

                //create notif object and user notif object
                if (userids.Count() > 0)
                {
                    CreateNotificationInput nd = new CreateNotificationInput();
                    nd.Message = String.Format(L("AssignLeadUpdate"), output.LeadCode);
                    nd.TransactionCode = output.LeadCode;
                    nd.TransactionId = Convert.ToInt32(output.LeadId);
                    nd.Action = "Leads2";
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

                    create.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
                }

                //old
                userids = new List<long>();
                empInput = new GetEmployeeInput();
                empInput.Id = oldAE.EmployeeId;
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

                //create notif object and user notif object
                if (userids.Count() > 0)
                {
                    CreateNotificationInput nd = new CreateNotificationInput();
                    nd.Message = String.Format(L("RemoveLeadUpdate"), output.LeadCode);
                    nd.TransactionCode = output.LeadCode;
                    nd.TransactionId = Convert.ToInt32(output.LeadId);
                    nd.Action = "Leads2";
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

                    create.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
                }
            }
            else
            {
                userids = new List<long>();
                //ae notif
                GetEmployeeInput empInput = new GetEmployeeInput();
                empInput.Id = output.AssignedToId;
                if (empInput.Id > 0)
                {
                    var emp = await _empService.GetEmployee(empInput);
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

                    //create notif object and user notif object
                    if (userids.Count() > 0)
                    {
                        CreateNotificationInput nd = new CreateNotificationInput();
                        nd.Message = String.Format(L("NewLeadUpdate"), output.LeadCode);
                        nd.TransactionCode = output.LeadCode;
                        nd.TransactionId = Convert.ToInt32(output.LeadId);
                        nd.Action = "Leads2";
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

                        create.Notifs.Add(Mapper.Map<GetNotificationOutput>(getntf));
                    }
                }
            }

            #endregion notifications

            return create;
        }

        public async Task DeleteLeadUpdate(DeleteLeadUpdateInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<GetLeadUpdateOutput> GetLeadUpdate(GetLeadUpdateInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetLeadUpdateOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetLeadUpdateOutput>> GetLeadUpdates(GetLeadUpdateListInput input)
        {
            var resultList = await _manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetLeadUpdateOutput>(listcount, ObjectMapper.Map<List<GetLeadUpdateOutput>>(resultList));
        }

        public async Task<PagedResultDto<GetLeadUpdateOutput>> GetLeadUpdatesByLeadId(GetLeadUpdateListByLeadIdInput input)
        {
            var resultList = await _manager.GetAllListByLeadId(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetLeadUpdateOutput>(listcount, ObjectMapper.Map<List<GetLeadUpdateOutput>>(resultList));
        }

        public async Task<FileDto> GetLeadUpdatesToExcel(GetLeadUpdateListInput input)
        {
            var resultList = await _manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, true);
            var resultToExport = ObjectMapper.Map<List<GetLeadUpdateOutput>>(resultList);
            var result = _exporter.ExportToFile(resultToExport);
            return result;
        }

        public async Task UpdateLeadUpdate(UpdateLeadUpdateInput input)
        {
            LeadUpdate output = Mapper.Map<UpdateLeadUpdateInput, LeadUpdate>(input);
            CheckErrors(await _manager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
