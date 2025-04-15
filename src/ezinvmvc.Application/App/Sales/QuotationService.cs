using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Sales.DTO;
using Abp.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Dto;
using ezinvmvc.App.Common;
using ezinvmvc.App.Sales.Models;
using ezinvmvc.App.Notification;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Notification.DTO;
using System;
using ezinvmvc.App.Notification.Models;
using ezinvmvc.App.Employees.Dto;

namespace ezinvmvc.App.Sales
{
    //[AbpAuthorize(PermissionNames.Pages_Quotations)]
    public class QuotationService : ezinvmvcAppServiceBase, IQuotationService
    {
        private readonly IQuotationManager _quotationManager;
        private readonly IQuotationItemManager _quotationItemManager;
        private readonly IQuotationChargeManager _quotationChargeManager;
        private readonly IRFQManager _rfqManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly ITasksManager _taskManager;
        private readonly IQuotationOtherItemsManager _quotationOtherItemsManager;
        //MARC LEEPE 01032023 notifications
        private readonly IEmployeeService _empService;
        private readonly INotificationManager _notifService;
        private readonly IUserNotificationManager _userNotifService;
        private readonly IStatusTypeManager _statusManager;

        //MARC SO QuotationRevision 06032024
        private readonly ISalesOrderManager _soManager;

        public QuotationService(IQuotationManager quotationmanager, IQuotationItemManager quotationitemmanager, IRFQManager rfqManager, ISeriesTypeManager seriestypemanager, IQuotationChargeManager quotationChargeManager, ITasksManager taskManager
        //MARC LEEPE 01032023 notifications
            , IEmployeeService empService, INotificationManager notifService, IUserNotificationManager userNotifService, IStatusTypeManager statusManager, IQuotationOtherItemsManager quotationOtherItemsManager,
            //MARC SO QuotationRevision 06032024
            ISalesOrderManager soManager)
        {
            _quotationManager = quotationmanager;
            _quotationItemManager = quotationitemmanager;
            _rfqManager = rfqManager;
            _seriesTypeManager = seriestypemanager;
            _quotationChargeManager = quotationChargeManager;
            _taskManager = taskManager;
            //MARC LEEPE 01032023 notifications
            _notifService = notifService;
            _userNotifService = userNotifService;
            _empService = empService;
            _statusManager = statusManager;
            _quotationOtherItemsManager = quotationOtherItemsManager;

            //MARC SO Manager
            _soManager = soManager;
        }
        public async Task<CreateQuotationOutput> CreateQuotation(CreateQuotationInput input)
        {
            var updaterfqstatus = await _rfqManager.GetByIdAsync(input.quotation.RequestId);
            updaterfqstatus.StatusId = 4;

            CheckErrors(await _rfqManager.UpdateAsync(updaterfqstatus));


            var updaterfqassigns = await _taskManager.GetAllByParentIdAsync(input.quotation.RequestId);

            foreach (Tasks task in updaterfqassigns)
            {
                task.Status = 1;
                CheckErrors(await _taskManager.UpdateAsync(task));
            }

            //MARC 01062023 duplicate
            //if (updaterfqassigns.Count() > 0)
            //{
            //    var task = updaterfqassigns.First();
            //    task.StatusID = 1;
            //    CheckErrors(await _taskManager.UpdateAsync(task));
            //}

            //CheckErrors(await _rfqManager.UpdateAsync(updaterfqstatus));
            //MARC 01062023 duplicate

            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.quotation.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.quotation.Code = seriescode;
            //series
            Quotation orderoutput = Mapper.Map<Quotation>(input.quotation);
            CheckErrors(await _quotationManager.CreateAsync(orderoutput));

            foreach (QuotationItemInput item in input.quotationitems)
            {
                item.QuotationId = orderoutput.Id;
                QuotationItem orderitemoutput = Mapper.Map<QuotationItem>(item);
                CheckErrors(await _quotationItemManager.CreateAsync(orderitemoutput));
            }

            foreach (QuotationChargeInput charge in input.quotationcharges)
            {
                charge.QuotationId = orderoutput.Id;
                QuotationCharge orderchargeoutput = Mapper.Map<QuotationCharge>(charge);
                CheckErrors(await _quotationChargeManager.CreateAsync(orderchargeoutput));
            }

            foreach (QuotationOtherItemInput items in input.quotationotheritem)
            {
                items.QuotationId = orderoutput.Id;
                QuotationOtherItem quotationotheritemoutput = Mapper.Map<QuotationOtherItem>(items);
                CheckErrors(await _quotationOtherItemsManager.CreateAsync(quotationotheritemoutput));
            }

            CreateQuotationOutput create = new CreateQuotationOutput();
            create.Quotation = Mapper.Map<QuotationOutput>(orderoutput);
            //set to return 0 id for notif object
            create.Notif = new GetNotificationOutput();

            //MARC LEEPE 01032023
            #region notifications

            #region notif v1
            //CreateNotificationInput nd = new CreateNotificationInput();
            //nd.Message = String.Format(L("NewQuotation"), orderoutput.Code);
            //nd.TransactionCode = orderoutput.Code;
            //nd.TransactionId = orderoutput.Id;
            //nd.Action = "Quotation";
            //Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
            //CheckErrors(await _notifService.CreateAsync(ntf));
            //var getntf = await _notifService.GetByIdAsync(ntf.Id);

            ////ae notif
            //GetEmployeeInput empInput = new GetEmployeeInput();
            //empInput.Id = orderoutput.SalesAgentId;

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

            ////sc notif
            //foreach(Tasks task in updaterfqassigns)
            //{
            //    empInput.Id = task.EmployeeId;
            //    if (empInput.Id > 0)
            //    {
            //        var emp = await _empService.GetEmployee(empInput);
            //        CreateUserNotificationInput und = new CreateUserNotificationInput();
            //        UserNotification untf = new UserNotification();
            //        string[] uids = getntf.UserIds.Split(',');
            //        if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId && !uids.Contains(emp.UserId.ToString()))
            //        {
            //            und.NotificationId = ntf.Id;
            //            und.UserId = emp.UserId;
            //            und.State = 0;
            //            und.CreationTime = DateTime.Now;
            //            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
            //            untf = Mapper.Map<UserNotification>(und);
            //            await _userNotifService.CreateAsync(untf);
            //        }
            //        if (emp.ManagerId > 0)
            //        {
            //            empInput.Id = emp.ManagerId;
            //            var mngr = await _empService.GetEmployee(empInput);
            //            uids = getntf.UserIds.Split(',');
            //            if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId && !uids.Contains(mngr.UserId.ToString()))
            //            {
            //                //manager notif
            //                und = new CreateUserNotificationInput();
            //                und.NotificationId = ntf.Id;
            //                und.UserId = mngr.UserId;
            //                und.State = 0;
            //                und.CreationTime = DateTime.Now;
            //                getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
            //                untf = Mapper.Map<UserNotification>(und);
            //                await _userNotifService.CreateAsync(untf);
            //            }
            //        }
            //    }
            //}
            #endregion notif v1

            //get user ids first
            List<long> userids = new List<long>();

            //ae notif
            GetEmployeeInput empInput = new GetEmployeeInput();
            empInput.Id = orderoutput.SalesAgentId;

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

            //sc notif
            foreach (Tasks task in updaterfqassigns)
            {
                empInput.Id = task.EmployeeId;
                if (empInput.Id > 0)
                {
                    var emp = await _empService.GetEmployee(empInput);
                    if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId && !userids.Contains(emp.UserId))
                    {
                        userids.Add(emp.UserId);
                    }
                    //sc manager notif
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
                nd.Message = String.Format(L("NewQuotation"), orderoutput.Code);
                nd.TransactionCode = orderoutput.Code;
                nd.TransactionId = orderoutput.Id;
                nd.Action = "Quotations";
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

            //return orderoutput.Id;
            return create;
        }

        public async Task<GetQuotationOutput> GetQuotation(GetQuotationInput input)
        {
            var getbyid = await _quotationManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetQuotationOutput>(getbyid);
        }

        public async Task<PagedResultDto<QuotationItemOutput>> GetQuotationItemsByParentId(GetQuotationInput input)
        {
            var resultList = await _quotationItemManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<QuotationItemOutput>(listcount, ObjectMapper.Map<List<QuotationItemOutput>>(resultList));
        }
        public async Task<PagedResultDto<QuotationChargeOutput>> GetQuotationChargesByParentId(GetQuotationInput input)
        {
            var resultList = await _quotationChargeManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<QuotationChargeOutput>(listcount, ObjectMapper.Map<List<QuotationChargeOutput>>(resultList));
        }
        public async Task<PagedResultDto<QuotationOutput>> GetQuotations(GetQuotationsInput input)
        {
            var resultList = await _quotationManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<QuotationOutput>(listcount, ObjectMapper.Map<List<QuotationOutput>>(resultList));
        }

        public async Task<IEnumerable<QuotationOutput>> GetQuotationRevisions(GetQuotationsInput input)
        {
            var resultList = await _quotationManager.GetAllRevisionList(input.Filter, input.Sorting);
            //int listcount = 0;
            //if (resultList.Count() > 0)
            //{
            //    listcount = resultList.First().TotalRows;
            //}
            return Mapper.Map<List<QuotationOutput>>(resultList);
        }

        public async Task<CreateQuotationOutput> UpdateQuotation(UpdateQuotationInput input)
        {
            try
            {
                Quotation updatequotation = Mapper.Map<Quotation>(input.quotation);
                Quotation createquotation = Mapper.Map<Quotation>(input.quotation);
                var reuturnint = 0;

                CreateQuotationOutput update = new CreateQuotationOutput();
                //set to return 0 id for notif object
                update.Notif = new GetNotificationOutput();

                var updaterfqassigns = await _taskManager.GetAllByParentIdAsync(input.quotation.RequestId);

                if (updatequotation.StatusId == 5)
                {
                    var updatequotationstatus = await _quotationManager.GetByIdAsync(updatequotation.Id);
                    updatequotationstatus.StatusId = 5;

                    CheckErrors(await _quotationManager.UpdateAsync(updatequotationstatus));

                    createquotation.Id = 0;
                    createquotation.RevisionNo = createquotation.RevisionNo + 1;
                    createquotation.StatusId = 1;

                    CheckErrors(await _quotationManager.CreateAsync(createquotation));
                    reuturnint = createquotation.Id;
                    foreach (QuotationItemInput item in input.quotationitems)
                    {
                        item.QuotationId = createquotation.Id;
                        QuotationItem orderitemoutput = Mapper.Map<QuotationItem>(item);
                        orderitemoutput.Id = 0;
                        CheckErrors(await _quotationItemManager.CreateAsync(orderitemoutput));
                    }
                    foreach (QuotationChargeInput charge in input.quotationcharges)
                    {
                        charge.QuotationId = createquotation.Id;
                        QuotationCharge orderchargeoutput = Mapper.Map<QuotationCharge>(charge);
                        orderchargeoutput.Id = 0;
                        CheckErrors(await _quotationChargeManager.CreateAsync(orderchargeoutput));
                    }
                    //MARC 01062023 new return
                    update.Quotation = Mapper.Map<QuotationOutput>(createquotation);
                    
                    //MARC SO QuotationRevision 06032024
                    //var getSo = await _soManager.GetAllList("null|null|null|null|null|null|null|null|null|null|" + updatequotationstatus.Id, "", 0, 0, true); //updatequotationstatus.Id is the revised quotation id
                    //if (getSo.Count() > 0)
                    //{
                    //    foreach (var so in getSo)
                    //    {
                    //        so.QuotationId = createquotation.Id;
                    //        //pwede din ito iset na for revision after marevise ni quotation
                    //        so.StatusPreRevision = so.StatusId;
                    //        so.StatusId = 6; //status 6 is for revision
                    //        so.RevisionReason = "Quotation Revision";
                    //        await _soManager.UpdateAsync(so);
                    //    }
                    //}
                }
                else
                {
                    CheckErrors(await _quotationManager.UpdateAsync(updatequotation));
                    reuturnint = updatequotation.Id;
                    foreach (QuotationItemInput item in input.quotationitems)
                    {
                        item.QuotationId = updatequotation.Id;
                        QuotationItem orderitemoutput = Mapper.Map<QuotationItem>(item);
                        if (item.IsDeleted == true)
                        {
                            CheckErrors(await _quotationItemManager.DeleteAsync(orderitemoutput.Id));
                        }
                        else
                        {
                            if (item.Id > 0)
                            {
                                CheckErrors(await _quotationItemManager.UpdateAsync(orderitemoutput));
                            }
                            else
                            {
                                CheckErrors(await _quotationItemManager.CreateAsync(orderitemoutput));
                            }
                        }
                    }

                    foreach (QuotationChargeInput charge in input.quotationcharges)
                    {
                        charge.QuotationId = updatequotation.Id;
                        QuotationCharge orderitemoutput = Mapper.Map<QuotationCharge>(charge);
                        if (charge.IsDeleted == true)
                        {
                            CheckErrors(await _quotationChargeManager.DeleteAsync(orderitemoutput.Id));
                        }
                        else
                        {
                            if (charge.Id > 0)
                            {
                                CheckErrors(await _quotationChargeManager.UpdateAsync(orderitemoutput));
                            }
                            else
                            {
                                CheckErrors(await _quotationChargeManager.CreateAsync(orderitemoutput));
                            }
                        }
                    }
                    //MARC 01062023 new return
                    update.Quotation = Mapper.Map<QuotationOutput>(updatequotation);
                }


                if (update.Quotation.StatusId > 1)
                {
                    //MARC LEEPE 01032023
                    #region notifications

                    #region notif v1
                    //if (update.Quotation.StatusId == 2 || update.Quotation.StatusId == 5)
                    //{
                    //    CreateNotificationInput nd = new CreateNotificationInput();
                    //    CreateUserNotificationInput und = new CreateUserNotificationInput();
                    //    UserNotification untf = Mapper.Map<UserNotification>(und);
                    //    if (update.Quotation.StatusId == 2)
                    //    {
                    //        nd.Message = String.Format(L("SubmitQuotation"), update.Quotation.Code);
                    //    }
                    //    else
                    //    {
                    //        //statusid == 5 
                    //        nd.Message = String.Format(L("RevisedQuotation"), update.Quotation.Code);
                    //    }
                    //    nd.TransactionCode = update.Quotation.Code;
                    //    nd.TransactionId = update.Quotation.Id;
                    //    nd.Action = "Quotation";
                    //    Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                    //    CheckErrors(await _notifService.CreateAsync(ntf));
                    //    var getntf = await _notifService.GetByIdAsync(ntf.Id);

                    //    if (updaterfqassigns.Count() > 0)
                    //    {
                    //        var task = updaterfqassigns.First();
                    //        //manager notif
                    //        GetEmployeeInput empInput = new GetEmployeeInput();
                    //        empInput.Id = task.EmployeeId;
                    //        if (empInput.Id > 0)
                    //        {
                    //            var emp = await _empService.GetEmployee(empInput);
                    //            if (emp.ManagerId > 0)
                    //            {
                    //                empInput.Id = emp.ManagerId;
                    //                var mngr = await _empService.GetEmployee(empInput);
                    //                if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId)
                    //                {
                    //                    und = new CreateUserNotificationInput();
                    //                    und.NotificationId = ntf.Id;
                    //                    und.UserId = mngr.UserId;
                    //                    und.State = 0;
                    //                    und.CreationTime = DateTime.Now;
                    //                    getntf.UserIds = und.UserId.ToString();
                    //                    untf = Mapper.Map<UserNotification>(und);
                    //                    await _userNotifService.CreateAsync(untf);
                    //                }
                    //            }
                    //        }
                    //    }

                    //    //permission notif
                    //    GetUserNotificationsInput upi = new GetUserNotificationsInput();
                    //    upi.Filter = "Pages.Quotations.ForOrder";
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
                    //if (update.Quotation.StatusId == 3)
                    //{
                    //    //for revision
                    //    CreateNotificationInput nd = new CreateNotificationInput();
                    //    nd.Message = String.Format(L("RevisionQuotation"), update.Quotation.Code);
                    //    nd.TransactionCode = update.Quotation.Code;
                    //    nd.TransactionId = update.Quotation.Id;
                    //    nd.Action = "Quotation";
                    //    Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                    //    CheckErrors(await _notifService.CreateAsync(ntf));
                    //    var getntf = await _notifService.GetByIdAsync(ntf.Id);

                    //    //assignee notif
                    //    if (updaterfqassigns.Count() > 0)
                    //    {
                    //        var task = updaterfqassigns.First();
                    //        GetEmployeeInput empInput = new GetEmployeeInput();
                    //        empInput.Id = task.EmployeeId;

                    //        if (empInput.Id > 0)
                    //        {
                    //            var emp = await _empService.GetEmployee(empInput);
                    //            CreateUserNotificationInput und = new CreateUserNotificationInput();
                    //            UserNotification untf = new UserNotification();
                    //            if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                    //            {
                    //                und = new CreateUserNotificationInput();
                    //                und.NotificationId = ntf.Id;
                    //                und.UserId = emp.UserId;
                    //                und.State = 0;
                    //                und.CreationTime = DateTime.Now;
                    //                getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
                    //                untf = Mapper.Map<UserNotification>(und);
                    //                await _userNotifService.CreateAsync(untf);
                    //            }
                    //        }
                    //    }
                    //    update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                    //}
                    //if(update.Quotation.StatusId == 6 || update.Quotation.StatusId == 7 || update.Quotation.StatusId == 8)
                    //{
                    //    CreateNotificationInput nd = new CreateNotificationInput();
                    //    CreateUserNotificationInput und = new CreateUserNotificationInput();
                    //    string mes = "";

                    //    if (update.Quotation.StatusId == 6)
                    //    {
                    //        mes = String.Format(L("OrderQuotation"), update.Quotation.Code);
                    //    }
                    //    if (update.Quotation.StatusId == 7)
                    //    {
                    //        mes = String.Format(L("OutbidQuotation"), update.Quotation.Code);
                    //    }
                    //    if (update.Quotation.StatusId == 8)
                    //    {
                    //        mes = String.Format(L("CancelQuotation"), update.Quotation.Code);
                    //    }
                    //    nd.Message = mes;
                    //    nd.TransactionCode = update.Quotation.Code;
                    //    nd.TransactionId = update.Quotation.Id;
                    //    nd.Action = "Quotation";
                    //    Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                    //    CheckErrors(await _notifService.CreateAsync(ntf));
                    //    var getntf = await _notifService.GetByIdAsync(ntf.Id);

                    //    //ae notif
                    //    GetEmployeeInput empInput = new GetEmployeeInput();
                    //    UserNotification untf = new UserNotification();
                    //    empInput.Id = update.Quotation.SalesAgentId;

                    //    if (empInput.Id > 0)
                    //    {
                    //        var emp = await _empService.GetEmployee(empInput);
                    //        if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                    //        {
                    //            und = new CreateUserNotificationInput();
                    //            und.NotificationId = ntf.Id;
                    //            und.UserId = emp.UserId;
                    //            und.State = 0;
                    //            und.CreationTime = DateTime.Now;
                    //            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
                    //            untf = Mapper.Map<UserNotification>(und);
                    //            await _userNotifService.CreateAsync(untf);
                    //        }
                    //        empInput.Id = emp.ManagerId;
                    //        if(empInput.Id > 0)
                    //        {
                    //            var mngr = await _empService.GetEmployee(empInput);
                    //            untf = new UserNotification();
                    //            string[] uids = getntf.UserIds.Split(',');
                    //            if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId && !uids.Contains(mngr.UserId.ToString()))
                    //            {
                    //                und = new CreateUserNotificationInput();
                    //                und.NotificationId = ntf.Id;
                    //                und.UserId = mngr.UserId;
                    //                und.State = 0;
                    //                und.CreationTime = DateTime.Now;
                    //                getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
                    //                untf = Mapper.Map<UserNotification>(und);
                    //                await _userNotifService.CreateAsync(untf);
                    //            }
                    //        }
                    //    }

                    //    //assignee notif
                    //    if (updaterfqassigns.Count() > 0)
                    //    {
                    //        var task = updaterfqassigns.First();
                    //        empInput = new GetEmployeeInput();
                    //        empInput.Id = task.EmployeeId;

                    //        if (empInput.Id > 0)
                    //        {
                    //            var emp = await _empService.GetEmployee(empInput);
                    //            und = new CreateUserNotificationInput();
                    //            untf = new UserNotification();
                    //            string[] uids = getntf.UserIds.Split(',');
                    //            if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId && !uids.Contains(emp.UserId.ToString()))
                    //            {
                    //                und = new CreateUserNotificationInput();
                    //                und.NotificationId = ntf.Id;
                    //                und.UserId = emp.UserId;
                    //                und.State = 0;
                    //                und.CreationTime = DateTime.Now;
                    //                getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? und.UserId.ToString() : "," + und.UserId.ToString();
                    //                untf = Mapper.Map<UserNotification>(und);
                    //                await _userNotifService.CreateAsync(untf);
                    //            }
                    //        }
                    //    }

                    //    if (update.Quotation.StatusId == 6)
                    //    {
                    //        //permission notif
                    //        GetUserNotificationsInput upi = new GetUserNotificationsInput();
                    //        upi.Filter = "Pages.Sales.Orders.Create";
                    //        var up = await _userNotifService.GetUsersByPermissionList(upi.Filter, "");
                    //        var upe = Mapper.Map<List<GetEmployeeOutput>>(up);

                    //        foreach (GetEmployeeOutput users in upe)
                    //        {
                    //            string[] uids = getntf.UserIds.Split(',');
                    //            if (users.UserId > 0 && users.UserId != (int)AbpSession.UserId && !uids.Contains(users.UserId.ToString()))
                    //            {
                    //                und = new CreateUserNotificationInput();
                    //                und.NotificationId = ntf.Id;
                    //                und.UserId = users.UserId;
                    //                und.State = 0;
                    //                und.CreationTime = DateTime.Now;
                    //                untf = Mapper.Map<UserNotification>(und);
                    //                await _userNotifService.CreateAsync(untf);
                    //                getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? users.UserId.ToString() : "," + users.UserId.ToString();
                    //            }
                    //        }
                    //    }

                    //    update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                    //}
                    #endregion notif v1

                    //get user ids first
                    List<long> userids = new List<long>();
                    string ndMess = "";

                    if (update.Quotation.StatusId == 2 || update.Quotation.StatusId == 5)
                    {
                        userids = new List<long>();
                        if (update.Quotation.StatusId == 2)
                        {
                            ndMess = String.Format(L("SubmitQuotation"), update.Quotation.Code);
                        }
                        else
                        {
                            //statusid == 5 
                            ndMess = String.Format(L("RevisedQuotation"), update.Quotation.Code);
                        }

                        if (updaterfqassigns.Count() > 0)
                        {
                            var task = updaterfqassigns.First();
                            GetEmployeeInput empInput = new GetEmployeeInput();
                            empInput.Id = task.EmployeeId;
                            //sc notif
                            if (empInput.Id > 0)
                            {
                                var emp = await _empService.GetEmployee(empInput);
                                if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                                {
                                    userids.Add(emp.UserId);
                                }
                                //sc manager notif
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

                        //permission notif
                        GetUserNotificationsInput upi = new GetUserNotificationsInput();
                        upi.Filter = "Pages.Quotations.ForOrder";
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
                    if (update.Quotation.StatusId == 3)
                    {
                        userids = new List<long>();
                        //for revision
                        ndMess = String.Format(L("RevisionQuotation"), update.Quotation.Code);

                        //sc notif
                        if (updaterfqassigns.Count() > 0)
                        {
                            var task = updaterfqassigns.First();
                            GetEmployeeInput empInput = new GetEmployeeInput();
                            empInput.Id = task.EmployeeId;

                            if (empInput.Id > 0)
                            {
                                var emp = await _empService.GetEmployee(empInput);
                                CreateUserNotificationInput und = new CreateUserNotificationInput();
                                UserNotification untf = new UserNotification();
                                if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                                {
                                    userids.Add(emp.UserId);
                                }
                                //sc manager notif
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
                    }
                    if (update.Quotation.StatusId == 6 || update.Quotation.StatusId == 7 || update.Quotation.StatusId == 8)
                    {
                        userids = new List<long>();

                        if (update.Quotation.StatusId == 7)
                        {
                            ndMess = String.Format(L("OutbidQuotation"), update.Quotation.Code);
                        }
                        if (update.Quotation.StatusId == 8)
                        {
                            ndMess = String.Format(L("CancelQuotation"), update.Quotation.Code);
                        }

                        GetEmployeeInput empInput = new GetEmployeeInput();
                        UserNotification untf = new UserNotification();
                        empInput.Id = update.Quotation.SalesAgentId;

                        //ae notif
                        if (empInput.Id > 0)
                        {
                            var emp = await _empService.GetEmployee(empInput);
                            if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                            {
                                userids.Add(emp.UserId);
                            }
                            //ae manager notif
                            if (emp.ManagerId > 0)
                            {
                                empInput.Id = emp.ManagerId;
                                if (empInput.Id > 0)
                                {
                                    var mngr = await _empService.GetEmployee(empInput);
                                    if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId && !userids.Contains(mngr.UserId))
                                    {
                                        userids.Add(mngr.UserId);
                                    }
                                }
                            }
                        }

                        //sc notif
                        if (updaterfqassigns.Count() > 0)
                        {
                            var task = updaterfqassigns.First();
                            empInput = new GetEmployeeInput();
                            empInput.Id = task.EmployeeId;

                            if (empInput.Id > 0)
                            {
                                var emp = await _empService.GetEmployee(empInput);
                                if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId && !userids.Contains(emp.UserId))
                                {
                                    userids.Add(emp.UserId);
                                }
                                //sc manager notif
                                if (emp.ManagerId > 0)
                                {
                                    empInput.Id = emp.ManagerId;
                                    if (empInput.Id > 0)
                                    {
                                        var mngr = await _empService.GetEmployee(empInput);
                                        if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId && !userids.Contains(mngr.UserId))
                                        {
                                            userids.Add(mngr.UserId);
                                        }
                                    }
                                }
                            }
                        }

                        if (update.Quotation.StatusId == 6)
                        {
                            ndMess = String.Format(L("OrderQuotation"), update.Quotation.Code);
                            //permission notif
                            GetUserNotificationsInput upi = new GetUserNotificationsInput();
                            upi.Filter = "Pages.Sales.Orders.Create";
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
                    }

                    //check if there are users then create notification object and usernotif objects
                    if (userids.Count() > 0)
                    {
                        CreateNotificationInput nd = new CreateNotificationInput();
                        nd.Message = ndMess;
                        nd.TransactionCode = update.Quotation.Code;
                        nd.TransactionId = update.Quotation.Id;
                        nd.Action = "Quotations";
                        Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                        CheckErrors(await _notifService.CreateAsync(ntf));
                        var getntf = await _notifService.GetByIdAsync(ntf.Id);

                        foreach (long userid in userids)
                        {
                            CreateUserNotificationInput und = new CreateUserNotificationInput();
                            und.NotificationId = ntf.Id;
                            und.UserId = userid;
                            und.State = 0;
                            und.CreationTime = DateTime.Now;
                            UserNotification untf = Mapper.Map<UserNotification>(und);
                            await _userNotifService.CreateAsync(untf);
                            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? userid.ToString() : "," + userid.ToString();
                        }

                        //set return notif to created notif object
                        update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                    }

                    #endregion notifications
                }

                await CurrentUnitOfWork.SaveChangesAsync();

                //return returnint;
                return update;
            }
            catch (Exception ex)
            {
                CreateQuotationOutput exception = new CreateQuotationOutput();
                exception.Quotation = new QuotationOutput();
                //set to return 0 id for notif object
                exception.Notif = new GetNotificationOutput();
                return exception;
            }
}

        //wilson 05182023
        public async Task<PagedResultDto<GetQuotationOtherItemOutput>> GetRfqOtherDetailsByParentId(GetQuotationOtherItemInput input)
        {
            var resultList = await _quotationOtherItemsManager.GetAllListAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<GetQuotationOtherItemOutput>(listcount, ObjectMapper.Map<List<GetQuotationOtherItemOutput>>(resultList));
        }

        public async Task DeleteAsync(DeleteQuotationOtherItemInput input)
        {
            CheckErrors(await _quotationOtherItemsManager.DeleteAsync(input.Id));
        }

        public async Task CreateRFQOtherDetails(QuotationOtherItemInput input)
        {
            QuotationOtherItem output = Mapper.Map<QuotationOtherItem>(input);
            CheckErrors(await _quotationOtherItemsManager.CreateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task UpdateRFQOtherDetails(QuotationOtherItemInput input)
        {
            QuotationOtherItem output = Mapper.Map<QuotationOtherItemInput, QuotationOtherItem>(input);
            CheckErrors(await _quotationOtherItemsManager.UpdateAsync(output));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
