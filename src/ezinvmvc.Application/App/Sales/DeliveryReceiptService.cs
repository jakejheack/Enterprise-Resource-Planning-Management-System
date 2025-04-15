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
using System;
using ezinvmvc.App.Stocks;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Notification.Models;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Notification;

namespace ezinvmvc.App.Sales
{
    public class DeliveryReceiptService : ezinvmvcAppServiceBase, IDeliveryReceiptService
    {
        private readonly ISalesOrderManager _orderManager;
        private readonly ISalesOrderItemManager _orderItemManager;
        private readonly ISalesOrderChargeManager _orderChargeManager;
        private readonly IDeliveryReceiptManager _deliveryReceiptManager;
        private readonly IDeliveryReceiptItemManager _deliveryReceiptItemManager;
        private readonly IDeliveryReceiptChargeManager _deliveryReceiptChargeManager;
        private readonly IStockCardManager _stockEntryCardManager;
        private readonly IRFQManager _rfqManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly ITasksManager _taskManager;
        //MARC LEEPE 12182022 notifications
        private readonly IEmployeeService _empService;
        private readonly INotificationManager _notifService;
        private readonly IUserNotificationManager _userNotifService;

        public DeliveryReceiptService(ISalesOrderManager ordermanager, ISalesOrderItemManager orderitemmanager, ISalesOrderChargeManager orderchargemanager, IDeliveryReceiptManager deliveryReceiptmanager, IDeliveryReceiptItemManager deliveryReceiptitemmanager, IRFQManager rfqManager, ISeriesTypeManager seriestypemanager, IDeliveryReceiptChargeManager deliveryReceiptChargeManager, ITasksManager taskManager, IStockCardManager stockEntryCardManager, IEmployeeService empService, INotificationManager notifService, IUserNotificationManager userNotifService)
        {
            _deliveryReceiptManager = deliveryReceiptmanager;
            _deliveryReceiptItemManager = deliveryReceiptitemmanager;
            _deliveryReceiptChargeManager = deliveryReceiptChargeManager;
            _stockEntryCardManager = stockEntryCardManager;
            _rfqManager = rfqManager;
            _seriesTypeManager = seriestypemanager;
            _taskManager = taskManager;
            _orderManager = ordermanager;
            _orderItemManager = orderitemmanager;
            _orderChargeManager = orderchargemanager;
            //MARC LEEPE 12182022 notifications
            _notifService = notifService;
            _userNotifService = userNotifService;
            _empService = empService;
        }

        public async Task<CreateDeliveryReceiptOutput> CreateDeliveryReceipt(CreateDeliveryReceiptInput input)
        {
            try
            {
                //series
                var seriestype = await _seriesTypeManager.GetByIdAsync(input.deliveryreceipt.SeriesTypeId);
                int nextseries = seriestype.LastSeries + 1;
                string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
                seriestype.LastSeries = nextseries;
                CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
                input.deliveryreceipt.Code = seriescode;
                //series
                DeliveryReceipt output = Mapper.Map<DeliveryReceipt>(input.deliveryreceipt);
                CheckErrors(await _deliveryReceiptManager.CreateAsync(output));
                foreach (DeliveryReceiptItemInput item in input.deliveryreceiptitem)
                {
                    item.DeliveryReceiptId = output.Id;
                    DeliveryReceiptItem itemoutput = Mapper.Map<DeliveryReceiptItem>(item);
                    CheckErrors(await _deliveryReceiptItemManager.CreateAsync(itemoutput));
                }
                foreach (DeliveryReceiptChargeInput charge in input.deliveryreceiptcharge)
                {
                    charge.DeliveryReceiptId = output.Id;
                    DeliveryReceiptCharge chargeoutput = Mapper.Map<DeliveryReceiptCharge>(charge);
                    CheckErrors(await _deliveryReceiptChargeManager.CreateAsync(chargeoutput));
                }

                //MARC 09/22.2021
                if (input.deliveryreceipt.IsMoveOrderStatus == 1)
                {
                    var salesorder = await _orderManager.GetByIdAsync(input.deliveryreceipt.SalesOrderId);
                    //MARC 11142022 fix for delivery status
                    if (salesorder.StatusId < 4)
                    {
                        salesorder.StatusId = 4;
                        CheckErrors(await _orderManager.UpdateAsync(salesorder));
                    }
                }
                //END MARC 09/22/2021

                CreateDeliveryReceiptOutput create = new CreateDeliveryReceiptOutput();
                create.DeliveryReceipt = Mapper.Map<DeliveryReceiptOutput>(output);
                //set to return 0 id for notif object
                create.Notif = new GetNotificationOutput();

                //MARC LEEPE 01032023
                #region notifications

                #region notif v1
                //CreateNotificationInput nd = new CreateNotificationInput();
                //nd.Message = String.Format(L("NewOrder"), orderoutput.Code);
                //nd.TransactionCode = orderoutput.Code;
                //nd.TransactionId = orderoutput.Id;
                //nd.Action = "SalesOrders";
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
                #endregion notif v1

                //get user ids first
                List<long> userids = new List<long>();

                //ae notif
                GetEmployeeInput empInput = new GetEmployeeInput();
                empInput.Id = output.SalesAgentId;

                if (empInput.Id > 0)
                {
                    var emp = await _empService.GetEmployee(empInput);
                    CreateUserNotificationInput und = new CreateUserNotificationInput();
                    UserNotification untf = new UserNotification();
                    if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                    {
                        userids.Add(emp.UserId);
                    }
                    //ae manager notif
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
                upi.Filter = "Pages.Sales.Orders.ForDelivery";
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
                if (userids.Count() > 0)
                {
                    CreateNotificationInput nd = new CreateNotificationInput();
                    nd.Message = String.Format(L("NewDelivery"), output.Code);
                    nd.TransactionCode = output.Code;
                    nd.TransactionId = output.Id;
                    nd.Action = "DeliveryReceipt";
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
                //return output.Id;
                return create;
            }
            catch (Exception ex)
            {
                CreateDeliveryReceiptOutput exception = new CreateDeliveryReceiptOutput();
                exception.DeliveryReceipt = new DeliveryReceiptOutput();
                //set to return 0 id for notif object
                exception.Notif = new GetNotificationOutput();
                return exception;
            }
        }

        public async Task<DeliveryReceiptOutput> GetDeliveryReceipt(GetDeliveryReceiptInput input)
        {
            var getbyid = await _deliveryReceiptManager.GetByIdAsync(input.Id);
            return Mapper.Map<DeliveryReceiptOutput>(getbyid);
        }

        public async Task<PagedResultDto<DeliveryReceiptChargeOutput>> GetDeliveryReceiptChargesByParentId(GetDeliveryReceiptInput input)
        {
            var resultList = await _deliveryReceiptChargeManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<DeliveryReceiptChargeOutput>(listcount, ObjectMapper.Map<List<DeliveryReceiptChargeOutput>>(resultList));
        }

        public async Task<PagedResultDto<DeliveryReceiptItemOutput>> GetDeliveryReceiptItemsByParentId(GetDeliveryReceiptInput input)
        {
            var resultList = await _deliveryReceiptItemManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<DeliveryReceiptItemOutput>(listcount, ObjectMapper.Map<List<DeliveryReceiptItemOutput>>(resultList));
        }

        public async Task<PagedResultDto<DeliveryReceiptOutput>> GetDeliveryReceipts(GetDeliveryReceiptsInput input)
        {
            var resultList = await _deliveryReceiptManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<DeliveryReceiptOutput>(listcount, ObjectMapper.Map<List<DeliveryReceiptOutput>>(resultList));
        }

        public async Task<CreateDeliveryReceiptOutput> UpdateDeliveryReceipt(UpdateDeliveryReceiptInput input)
        {
            try
            {
                DeliveryReceipt output = Mapper.Map<DeliveryReceipt>(input.deliveryreceipt);

                CheckErrors(await _deliveryReceiptManager.UpdateAsync(output));

                foreach (DeliveryReceiptItemInput item in input.deliveryreceiptitem)
                {
                    item.DeliveryReceiptId = output.Id;
                    DeliveryReceiptItem itemoutput = Mapper.Map<DeliveryReceiptItem>(item);

                    if (item.IsDeleted == true)
                    {
                        CheckErrors(await _deliveryReceiptItemManager.DeleteAsync(itemoutput.Id));
                    }
                    else
                    {
                        if (item.Id > 0)
                        {
                            CheckErrors(await _deliveryReceiptItemManager.UpdateAsync(itemoutput));
                        }
                        else
                        {
                            CheckErrors(await _deliveryReceiptItemManager.CreateAsync(itemoutput));
                        }
                    }

                    //var orderitem = await _orderItemManager.GetAllByParentId(input.deliveryreceipt.SalesOrderId);

                    //bool isMoveOrderStatus = false;
                    //decimal bal = 0;
                    //foreach (SalesOrderItem soi in orderitem)
                    //{
                    //    bal += (soi.OrderQty - soi.DeliveryQty);
                    //}

                    //if(bal == 0)
                    //{
                    //    isMoveOrderStatus = true;
                    //}

                    //if (isMoveOrderStatus)
                    //{
                    //    var salesorder = await _orderManager.GetByIdAsync(input.deliveryreceipt.SalesOrderId);
                    //    salesorder.StatusId = 3;
                    //    CheckErrors(await _orderManager.UpdateAsync(salesorder));
                    //}

                    if (input.deliveryreceipt.StatusId == 2)
                    {
                        var seriestype = await _seriesTypeManager.GetByIdAsync(input.deliveryreceipt.SeriesTypeId);
                        //MARC 09/08/2021
                        //var qty = itemoutput.Qty;
                        var qty = (decimal)itemoutput.DeliveredQty;
                        //END
                        qty = qty * -1;
                        if (qty != 0)
                        {
                            var warehouseid = input.deliveryreceipt.DefaultSourceId;
                            var stockcard = new StockCard
                            {
                                TransactionCode = input.deliveryreceipt.Code,
                                TransactionTypeId = seriestype.TransactionId,
                                TransactionId = itemoutput.DeliveryReceiptId,
                                TransactionItemId = itemoutput.Id,
                                TransactionTime = input.deliveryreceipt.TransactionTime,
                                ProductId = itemoutput.ProductId,
                                Qty = qty,
                                UnitId = itemoutput.UnitId,
                                WarehouseId = input.deliveryreceipt.DefaultSourceId
                            };
                            CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                        }

                    }
                }

                foreach (DeliveryReceiptChargeInput charge in input.deliveryreceiptcharge)
                {
                    charge.DeliveryReceiptId = output.Id;
                    DeliveryReceiptCharge chargeoutput = Mapper.Map<DeliveryReceiptCharge>(charge);

                    if (charge.IsDeleted == true)
                    {
                        CheckErrors(await _deliveryReceiptChargeManager.DeleteAsync(chargeoutput.Id));
                    }
                    else
                    {
                        if (charge.Id > 0)
                        {
                            CheckErrors(await _deliveryReceiptChargeManager.UpdateAsync(chargeoutput));
                        }
                        else
                        {
                            CheckErrors(await _deliveryReceiptChargeManager.CreateAsync(chargeoutput));
                        }
                    }
                }

                CreateDeliveryReceiptOutput update = new CreateDeliveryReceiptOutput();
                update.DeliveryReceipt = Mapper.Map<DeliveryReceiptOutput>(output);
                //set to return 0 id for notif object
                update.Notif = new GetNotificationOutput();

                if (output.StatusId > 1)
                {
                    #region notifications

                    //get user ids first
                    List<long> userids = new List<long>();
                    string ndMess = "";

                    //ae notif
                    GetEmployeeInput empInput = new GetEmployeeInput();

                    if (output.SalesAgentId > 0)
                    {
                        empInput.Id = output.SalesAgentId;
                        var emp = await _empService.GetEmployee(empInput);
                        CreateUserNotificationInput und = new CreateUserNotificationInput();
                        UserNotification untf = new UserNotification();
                        if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                        {
                            userids.Add(emp.UserId);
                        }
                        //ae manager notif
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

                    if (output.StatusId == 2)
                    {
                        userids = new List<long>();
                        ndMess = String.Format(L("SubmitDelivery"), output.Code);

                        //permission notif
                        GetUserNotificationsInput upi = new GetUserNotificationsInput();
                        upi.Filter = "Pages.Sales.Orders.ForDelivery";
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
                    if (output.StatusId == 3)
                    {
                        userids = new List<long>();
                        ndMess = String.Format(L("BillDelivery"), output.Code);

                        ////ae notif
                        //if (output.SalesAgentId > 0)
                        //{
                        //    empInput.Id = output.SalesAgentId;
                        //    var emp = await _empService.GetEmployee(empInput);
                        //    if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                        //    {
                        //        userids.Add(emp.UserId);
                        //    }
                        //    //ae manager notif
                        //    if (emp.ManagerId > 0)
                        //    {
                        //        empInput.Id = output.SalesAgentId;
                        //        var mngr = await _empService.GetEmployee(empInput);
                        //        if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId && !userids.Contains(mngr.UserId))
                        //        {
                        //            userids.Add(mngr.UserId);
                        //        }
                        //    }
                        //}

                        //permission notif
                        GetUserNotificationsInput upi = new GetUserNotificationsInput();
                        upi.Filter = "Pages.Delivery.Receipt.Create";
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

                    //check if there are users then create notification object and usernotif objects
                    if (userids.Count() > 0)
                    {
                        CreateNotificationInput nd = new CreateNotificationInput();
                        nd.Message = ndMess;
                        nd.TransactionCode = output.Code;
                        nd.TransactionId = output.Id;
                        nd.Action = "DeliveryReceipt";
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
                //return output.Id;
                return update;
            }
            catch (Exception ex)
            {
                CreateDeliveryReceiptOutput exception = new CreateDeliveryReceiptOutput();
                exception.DeliveryReceipt = new DeliveryReceiptOutput();
                //set to return 0 id for notif object
                exception.Notif = new GetNotificationOutput();
                return exception;
            }
        }

        public async Task<CreateDeliveryReceiptOutput> UpdateSalesOrderDeliveryStatus(UpdateDeliveryReceiptInput input)
        {
            try
            {
                var output = await _deliveryReceiptManager.GetByIdAsync(input.deliveryreceipt.Id);

                var orderitem = await _orderItemManager.GetAllByParentId(input.deliveryreceipt.SalesOrderId);

                bool isMoveOrderStatus = false;
                decimal bal = 0;
                foreach (SalesOrderItem soi in orderitem)
                {
                    bal += (soi.OrderQty - soi.DeliveryQty);
                }

                if (bal == 0)
                {
                    isMoveOrderStatus = true;
                }

                int transactionId = 0;
                string transactionCode = "";

                if (isMoveOrderStatus)
                {
                    var salesorder = await _orderManager.GetByIdAsync(input.deliveryreceipt.SalesOrderId);
                    salesorder.StatusId = 4;
                    transactionId = salesorder.Id;
                    transactionCode = salesorder.Code;
                    CheckErrors(await _orderManager.UpdateAsync(salesorder));
                }
                else
                {
                    var salesorder = await _orderManager.GetByIdAsync(input.deliveryreceipt.SalesOrderId);
                    salesorder.StatusId = 3;
                    transactionId = salesorder.Id;
                    transactionCode = salesorder.Code;
                    CheckErrors(await _orderManager.UpdateAsync(salesorder));
                }

                CreateDeliveryReceiptOutput create = new CreateDeliveryReceiptOutput();
                create.DeliveryReceipt = Mapper.Map<DeliveryReceiptOutput>(output);
                //set to return 0 id for notif object
                create.Notif = new GetNotificationOutput();

                //MARC LEEPE 01032023
                #region notifications

                //get user ids first
                List<long> userids = new List<long>();

                if (isMoveOrderStatus)
                {
                    //ae notif
                    GetEmployeeInput empInput = new GetEmployeeInput();
                    empInput.Id = output.SalesAgentId;

                    if (empInput.Id > 0)
                    {
                        var emp = await _empService.GetEmployee(empInput);
                        CreateUserNotificationInput und = new CreateUserNotificationInput();
                        UserNotification untf = new UserNotification();
                        if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                        {
                            userids.Add(emp.UserId);
                        }
                        //ae manager notif
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
                    upi.Filter = "Pages.Sales.Orders.ForDelivery";
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

                //check if there are users then create notification object and usernotif objects
                if (userids.Count() > 0)
                {
                    CreateNotificationInput nd = new CreateNotificationInput();
                    nd.Message = String.Format(L("DeliveredOrder"), transactionCode);
                    nd.TransactionCode = transactionCode;
                    nd.TransactionId = transactionId;
                    nd.Action = "SalesOrder";
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
                //return input.deliveryreceipt.Id;
                return create;
            }
            catch (Exception ex)
            {
                CreateDeliveryReceiptOutput exception = new CreateDeliveryReceiptOutput();
                exception.DeliveryReceipt = new DeliveryReceiptOutput();
                //set to return 0 id for notif object
                exception.Notif = new GetNotificationOutput();
                return exception;
            }
        }
    }
}
