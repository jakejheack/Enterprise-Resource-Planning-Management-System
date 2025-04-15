using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Clients;
using ezinvmvc.App.Clients.Dto;
using ezinvmvc.App.Common;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Leads;
using ezinvmvc.App.Leads.Dto;
using ezinvmvc.App.Notification;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.App.Notification.Models;
using ezinvmvc.App.Sales.Dto;
using ezinvmvc.App.Sales.DTO;
using ezinvmvc.App.Sales.Models;
using ezinvmvc.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
    //[AbpAuthorize(PermissionNames.Pages_Rfq)]
    public class RFQService : ezinvmvcAppServiceBase, IRFQService
    {
        private readonly IRFQManager _rfqManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly IRFQDetailsManager _rfqDetailsManager;
        private readonly IRFQOtherDetailsManager _rfqOtherDetailsManager;
        //MARC LEEPE 01032023 notifications
        private readonly IEmployeeService _empService;
        private readonly INotificationManager _notifService;
        private readonly IUserNotificationManager _userNotifService;
        private readonly IStatusTypeManager _statusManager;
        private readonly ILeadService _leadService;
        private readonly IClientService _clientService;

        public RFQService(IRFQManager rfqManager, ISeriesTypeManager seriesTypeManager, IRFQDetailsManager rfqDetailsManager, IRFQOtherDetailsManager rfqOtherDetailsManager
            //MARC LEEPE 01032023 notifications
            , IEmployeeService empService, INotificationManager notifService, IUserNotificationManager userNotifService, IStatusTypeManager statusManager, ILeadService leadService, IClientService clientService)
        {
            _rfqManager = rfqManager;
            _rfqDetailsManager = rfqDetailsManager;
            _seriesTypeManager = seriesTypeManager;
            _rfqOtherDetailsManager = rfqOtherDetailsManager;
            //MARC LEEPE 01032023 notifications
            _notifService = notifService;
            _userNotifService = userNotifService;
            _empService = empService;
            _statusManager = statusManager;
            _leadService = leadService;
            _clientService = clientService;
        }

        public async Task<CreateRFQOutput> CreateRFQ(CreateRFQInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.rfq.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.rfq.Code = seriescode;
            //series
            RFQ rfqoutput = Mapper.Map<RFQ>(input.rfq);
            CheckErrors(await _rfqManager.CreateAsync(rfqoutput));

            foreach (RFQDetailsInput item in input.rfqdetails)
            {
                item.RFQId = rfqoutput.Id;
                RFQDetails rfqdetailsoutput = Mapper.Map<RFQDetails>(item);
                CheckErrors(await _rfqDetailsManager.CreateAsync(rfqdetailsoutput));
            }
            foreach (RFQOtherDetailsInput item in input.rfqotherdetails)
            {
                item.RFQId = rfqoutput.Id;
                RFQOtherDetails rfqotherdetailsoutput = Mapper.Map<RFQOtherDetails>(item);
                CheckErrors(await _rfqOtherDetailsManager.CreateAsync(rfqotherdetailsoutput));
            }

            CreateRFQOutput create = new CreateRFQOutput();
            create.Rfq = Mapper.Map<GetRFQOutput>(rfqoutput);
            //set to return 0 id for notification object
            create.Notif = new GetNotificationOutput();

            //MARC LEEPE 01032023
            #region notifications

            #region notif v1
            //CreateNotificationInput nd = new CreateNotificationInput();
            //nd.Message = String.Format(L("NewRFQ"), rfqoutput.Code);
            //nd.TransactionCode = rfqoutput.Code;
            //nd.TransactionId = rfqoutput.Id;
            //nd.Action = "RFQ";
            //Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //CheckErrors(await _notifService.CreateAsync(ntf));
            //var getntf = await _notifService.GetByIdAsync(ntf.Id);

            ////ae notif
            //GetEmployeeInput empInput = new GetEmployeeInput();
            //if (rfqoutput.LeadId > 0)
            //{
            //    GetLeadInput ldin = new GetLeadInput();
            //    ldin.Id = rfqoutput.LeadId;
            //    var leadout = await _leadService.GetLead(ldin);
            //    empInput.Id = leadout.UAssignedToId;
            //}
            //else
            //{
            //    GetClientInput clin = new GetClientInput();
            //    clin.Id = rfqoutput.ClientId;
            //    var clout = await _clientService.GetClient(clin);
            //    empInput.Id = clout.AssignedToId;
            //}

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
            //        getntf.UserIds = und.UserId.ToString();
            //        untf = Mapper.Map<UserNotification>(und);
            //        await _userNotifService.CreateAsync(untf);
            //    }
            //    if (emp.ManagerId > 0)
            //    {
            //        empInput.Id = emp.ManagerId;
            //        var mngr = await _empService.GetEmployee(empInput);
            //        if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId)
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
            //}
            #endregion notif v1

            //get user ids first
            List<long> userids = new List<long>();

            //ae notif
            GetEmployeeInput empInput = new GetEmployeeInput();
            if (rfqoutput.LeadId > 0)
            {
                GetLeadInput ldin = new GetLeadInput();
                ldin.Id = rfqoutput.LeadId;
                var leadout = await _leadService.GetLead(ldin);
                empInput.Id = leadout.UAssignedToId;
            }
            else
            {
                GetClientInput clin = new GetClientInput();
                clin.Id = rfqoutput.ClientId;
                var clout = await _clientService.GetClient(clin);
                empInput.Id = clout.AssignedToId;
            }

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
            }

            //create notif object and user notif object
            if (userids.Count() > 0)
            { 
                CreateNotificationInput nd = new CreateNotificationInput();
                nd.Message = String.Format(L("NewRFQ"), rfqoutput.Code);
                nd.TransactionCode = rfqoutput.Code;
                nd.TransactionId = rfqoutput.Id;
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
                create.Notif = Mapper.Map<GetNotificationOutput>(getntf);
            }

            #endregion notifications

            await CurrentUnitOfWork.SaveChangesAsync();

            //return rfqoutput.Id;
            return create;
        }

        public async Task<GetRFQOutput> GetRFQ(GetRFQInput input)
        {
            var getbyid = await _rfqManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetRFQOutput>(getbyid);
        }

        public async Task<PagedResultDto<RFQDetailsOutput>> GetRfqDetailsByParentId(GetRFQInput input)
        {
            var resultList = await _rfqDetailsManager.GetAllByParentIdAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<RFQDetailsOutput>(listcount, ObjectMapper.Map<List<RFQDetailsOutput>>(resultList));
        }

        public async Task<PagedResultDto<RFQOutput>> GetRFQs(GetRFQListInput input)
        {
            var resultList = await _rfqManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, Convert.ToBoolean(input.ForExport));
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<RFQOutput>(listcount, ObjectMapper.Map<List<RFQOutput>>(resultList));
        }

        public async Task<IEnumerable<RFQOutput>> GetRFQRevisions(GetRFQListInput input)
        {
            var resultList = await _rfqManager.GetAllRevisionList(input.Filter, input.Sorting);
            //int listcount = 0;
            //if (resultList.Count() > 0)
            //{
            //    listcount = resultList.First().TotalRows;
            //}
            return Mapper.Map<List<RFQOutput>>(resultList);
        }

        public async Task<PagedResultDto<RFQOutput>> GetRFQsforQuotation(GetRFQListInput input)
        {
            var resultList = await _rfqManager.GetAllListforQuotation(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<RFQOutput>(listcount, ObjectMapper.Map<List<RFQOutput>>(resultList));
        }

        public async Task<CreateRFQOutput> UpdateRfq(UpdateRFQInput input)
        {
            try
            {
                RFQ updateqrfq = Mapper.Map<RFQ>(input.rfq);
                RFQ createrfq = Mapper.Map<RFQ>(input.rfq);
                var reuturnint = 0;

                CreateRFQOutput update = new CreateRFQOutput();
                //set to return 0 id for notification object
                update.Notif = new GetNotificationOutput();

                if (updateqrfq.StatusId == 5)
                {
                    var updaterfqstatus = await _rfqManager.GetByIdAsync(updateqrfq.Id);
                    updaterfqstatus.StatusId = 5;

                    CheckErrors(await _rfqManager.UpdateAsync(updaterfqstatus));

                    createrfq.Id = 0;
                    createrfq.RevisionNo = createrfq.RevisionNo + 1;
                    createrfq.StatusId = 2;

                    CheckErrors(await _rfqManager.CreateAsync(createrfq));
                    reuturnint = createrfq.Id;
                    foreach (RFQDetailsInput item in input.rfqdetails)
                    {
                        item.RFQId = createrfq.Id;
                        RFQDetails orderitemoutput = Mapper.Map<RFQDetails>(item);
                        orderitemoutput.Id = 0;
                        CheckErrors(await _rfqDetailsManager.CreateAsync(orderitemoutput));
                    }
                    //update.Rfq = Mapper.Map<GetRFQOutput>(createrfq);

                    foreach (RFQOtherDetailsInput items in input.rfqotherdetails)
                    {
                        items.RFQId = createrfq.Id;
                        RFQOtherDetails rfqotherdetails = Mapper.Map<RFQOtherDetails>(items);
                        //rfqotherdetails.Id = 0;
                        CheckErrors(await _rfqOtherDetailsManager.UpdateAsync(rfqotherdetails));
                    }
                    update.Rfq = Mapper.Map<GetRFQOutput>(createrfq);
                }
                else
                {
                    //updateqrfq.RevisionNo = revno;
                    CheckErrors(await _rfqManager.UpdateAsync(updateqrfq));
                    reuturnint = updateqrfq.Id;
                    foreach (RFQDetailsInput item in input.rfqdetails)
                    {
                        item.RFQId = updateqrfq.Id;
                        RFQDetails rfqoutput = Mapper.Map<RFQDetails>(item);
                        if (item.IsDeleted == true)
                        {
                            CheckErrors(await _rfqDetailsManager.DeleteAsync(rfqoutput.Id));
                        }
                        else
                        {
                            if (item.Id > 0)
                            {
                                CheckErrors(await _rfqDetailsManager.UpdateAsync(rfqoutput));
                            }
                            else
                            {
                                CheckErrors(await _rfqDetailsManager.CreateAsync(rfqoutput));
                            }
                        }
                    }
                    update.Rfq = Mapper.Map<GetRFQOutput>(updateqrfq);                    
                }


                if (updateqrfq.StatusId > 1)
                {
                    //MARC LEEPE 01032023
                    #region notifications

                    #region notif v1
                    //if (updateqrfq.StatusId == 2 || updateqrfq.StatusId == 5)
                    //{
                    //    CreateNotificationInput nd = new CreateNotificationInput();
                    //    if(updateqrfq.StatusId == 2)
                    //    {
                    //        nd.Message = String.Format(L("SubmitRFQ"), update.Rfq.Code);
                    //    }
                    //    else
                    //    {
                    //        //statusid == 5 
                    //        nd.Message = String.Format(L("RevisedRFQ"), update.Rfq.Code);
                    //    }
                    //    nd.TransactionCode = update.Rfq.Code;
                    //    nd.TransactionId = update.Rfq.Id;
                    //    nd.Action = "RFQ";
                    //    Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                    //    CheckErrors(await _notifService.CreateAsync(ntf));
                    //    var getntf = await _notifService.GetByIdAsync(ntf.Id);

                    //    //manager notif
                    //    GetEmployeeInput empInput = new GetEmployeeInput();
                    //    if (updateqrfq.LeadId > 0)
                    //    {
                    //        GetLeadInput ldin = new GetLeadInput();
                    //        ldin.Id = updateqrfq.LeadId;
                    //        var leadout = await _leadService.GetLead(ldin);
                    //        empInput.Id = leadout.UAssignedToId;
                    //    }
                    //    else
                    //    {
                    //        GetClientInput clin = new GetClientInput();
                    //        clin.Id = updateqrfq.ClientId;
                    //        var clout = await _clientService.GetClient(clin);
                    //        empInput.Id = clout.AssignedToId;
                    //    }
                    //    var emp = await _empService.GetEmployee(empInput);
                    //    CreateUserNotificationInput und = new CreateUserNotificationInput();
                    //    UserNotification untf = Mapper.Map<UserNotification>(und);
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
                    //    //permission notif
                    //    GetUserNotificationsInput upi = new GetUserNotificationsInput();
                    //    upi.Filter = "Pages.Rfq.Assign";
                    //    var up = await _userNotifService.GetUsersByPermissionList(upi.Filter, "");
                    //    var upe = Mapper.Map<List<GetEmployeeOutput>>(up);

                    //    foreach (GetEmployeeOutput users in upe)
                    //    {
                    //        string[] uids = getntf.UserIds.Split(',');
                    //        if (users.UserId > 0 && users.UserId != (int)AbpSession.UserId && !uids.Contains(users.UserId.ToString()))
                    //        {
                    //            und = new CreateUserNotificationInput();
                    //            und.NotificationId = ntf.Id;
                    //            und.UserId = users.UserId;
                    //            und.State = 0;
                    //            und.CreationTime = DateTime.Now;
                    //            untf = Mapper.Map<UserNotification>(und);
                    //            await _userNotifService.CreateAsync(untf);
                    //            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? users.UserId.ToString() : "," + users.UserId.ToString();
                    //        }
                    //    }

                    //    update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                    //}
                    //if (update.Rfq.StatusId == 3)
                    //{
                    //    //for revision
                    //    CreateNotificationInput nd = new CreateNotificationInput();
                    //    nd.Message = String.Format(L("RevisionRFQ"), update.Rfq.Code);
                    //    nd.TransactionCode = update.Rfq.Code;
                    //    nd.TransactionId = update.Rfq.Id;
                    //    nd.Action = "RFQ";
                    //    Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                    //    CheckErrors(await _notifService.CreateAsync(ntf));
                    //    var getntf = await _notifService.GetByIdAsync(ntf.Id);

                    //    //ae notif
                    //    GetEmployeeInput empInput = new GetEmployeeInput();
                    //    if (updateqrfq.LeadId > 0)
                    //    {
                    //        GetLeadInput ldin = new GetLeadInput();
                    //        ldin.Id = updateqrfq.LeadId;
                    //        var leadout = await _leadService.GetLead(ldin);
                    //        empInput.Id = leadout.UAssignedToId;
                    //    }
                    //    else
                    //    {
                    //        GetClientInput clin = new GetClientInput();
                    //        clin.Id = updateqrfq.ClientId;
                    //        var clout = await _clientService.GetClient(clin);
                    //        empInput.Id = clout.AssignedToId;
                    //    }
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
                    //            getntf.UserIds = und.UserId.ToString();
                    //            untf = Mapper.Map<UserNotification>(und);
                    //            await _userNotifService.CreateAsync(untf);
                    //        }
                    //    }
                    //    update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                    //}
                    #endregion notif v1

                    //get user ids first
                    List<long> userids = new List<long>();
                    string ndMess = "";
                    if (updateqrfq.StatusId == 2 || updateqrfq.StatusId == 5)
                    {
                        userids = new List<long>();
                        if (updateqrfq.StatusId == 2)
                        {
                            ndMess = String.Format(L("SubmitRFQ"), update.Rfq.Code);
                        }
                        else
                        {
                            ndMess = String.Format(L("RevisedRFQ"), update.Rfq.Code);
                        }

                        GetEmployeeInput empInput = new GetEmployeeInput();
                        if (updateqrfq.LeadId > 0)
                        {
                            GetLeadInput ldin = new GetLeadInput();
                            ldin.Id = updateqrfq.LeadId;
                            var leadout = await _leadService.GetLead(ldin);
                            empInput.Id = leadout.UAssignedToId;
                        }
                        else
                        {
                            GetClientInput clin = new GetClientInput();
                            clin.Id = updateqrfq.ClientId;
                            var clout = await _clientService.GetClient(clin);
                            empInput.Id = clout.AssignedToId;
                        }
                        //ae notif
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
                        }
                        //permission notif
                        GetUserNotificationsInput upi = new GetUserNotificationsInput();
                        upi.Filter = "Pages.Rfq.Assign";
                        var up = await _userNotifService.GetUsersByPermissionList(upi.Filter, "");
                        var upe = Mapper.Map<List<GetEmployeeOutput>>(up);

                        foreach (GetEmployeeOutput users in upe)
                        {
                            if (users.UserId > 0 && users.UserId != (int)AbpSession.UserId && !userids.Contains(users.UserId))
                            {
                                userids.Add(users.UserId);
                            }
                        }
                    }
                    if (update.Rfq.StatusId == 3)
                    {
                        userids = new List<long>();
                        //for revision
                        ndMess = String.Format(L("RevisionRFQ"), update.Rfq.Code);

                        //ae notif
                        GetEmployeeInput empInput = new GetEmployeeInput();
                        if (updateqrfq.LeadId > 0)
                        {
                            GetLeadInput ldin = new GetLeadInput();
                            ldin.Id = updateqrfq.LeadId;
                            var leadout = await _leadService.GetLead(ldin);
                            empInput.Id = leadout.UAssignedToId;
                        }
                        else
                        {
                            GetClientInput clin = new GetClientInput();
                            clin.Id = updateqrfq.ClientId;
                            var clout = await _clientService.GetClient(clin);
                            empInput.Id = clout.AssignedToId;
                        }
                        if (empInput.Id > 0)
                        {
                            var emp = await _empService.GetEmployee(empInput);
                            CreateUserNotificationInput und = new CreateUserNotificationInput();
                            UserNotification untf = new UserNotification();
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
                    }

                    //check if there are users then create notification object and usernotif objects
                    if (userids.Count() > 0)
                    {
                        CreateNotificationInput nd = new CreateNotificationInput();
                        nd.Message = ndMess;
                        nd.TransactionCode = update.Rfq.Code;
                        nd.TransactionId = update.Rfq.Id;
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
                        update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                    }
                    #endregion notifications
                }

                await CurrentUnitOfWork.SaveChangesAsync();

                //return reuturnint;
                return update;
            }
            catch (Exception ex)
            {
                CreateRFQOutput exception = new CreateRFQOutput();
                exception.Rfq = new GetRFQOutput();
                //set to return 0 id for notif object
                exception.Notif = new GetNotificationOutput();
                return exception;
            }
        }


        public async Task<PagedResultDto<RFQOtherDetailsOutput>> GetRfqOtherDetailsByParentId(GetRFQInput input)
        {
            var resultList = await _rfqOtherDetailsManager.GetAllListAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<RFQOtherDetailsOutput>(listcount, ObjectMapper.Map<List<RFQOtherDetailsOutput>>(resultList));
        }

        public async Task DeleteAsync(DeleteRFQOtherDetailsInput input)
        {
            CheckErrors(await _rfqOtherDetailsManager.DeleteAsync(input.Id));
        }

        public async Task CreateRFQOtherDetails(RFQOtherDetailsInput input)
        {
            RFQOtherDetails output = Mapper.Map<RFQOtherDetails>(input);
            CheckErrors(await _rfqOtherDetailsManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
        public async Task UpdateRFQOtherDetails(RFQOtherDetailsInput input)
        {
            RFQOtherDetails output = Mapper.Map<RFQOtherDetailsInput, RFQOtherDetails>(input);
            CheckErrors(await _rfqOtherDetailsManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

    }
}
