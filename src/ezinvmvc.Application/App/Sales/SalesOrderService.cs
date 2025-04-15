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
using ezinvmvc.App.Clients;
using System;
using ezinvmvc.App.Common.Dto;
using ezinvmvc.App.Stocks;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Notification;
using ezinvmvc.App.Notification.Models;

namespace ezinvmvc.App.Sales
{
    [AbpAuthorize(PermissionNames.Pages_Sales_Orders)]
    public class SalesOrderService : ezinvmvcAppServiceBase, ISalesOrderService
    {
        private readonly ISalesOrderManager _orderManager;
        private readonly ISalesOrderItemManager _orderItemManager;
        private readonly ISalesOrderChargeManager _orderChargeManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly IQuotationManager _quotationManager;
        private readonly IClientManager _clientManager;
        private readonly IWarehouseManager _warehouseManager;
        private readonly IStockCardManager _stockEntryCardManager;
        //MARC LEEPE 12182022 notifications
        private readonly IEmployeeService _empService;
        private readonly INotificationManager _notifService;
        private readonly IUserNotificationManager _userNotifService;

        //MARC SO Revision 06042024
        private readonly ISalesInvoiceManager _siManager;
        private readonly IDeliveryReceiptManager _drManager;

        public SalesOrderService(ISalesOrderManager ordermanager, ISalesOrderItemManager orderitemmanager, ISalesOrderChargeManager orderchargemanager, ISeriesTypeManager seriestypemanager, IQuotationManager quotationmanager, IClientManager clientManager, IWarehouseManager warehouseManager, IStockCardManager stockEntryCardManager, IEmployeeService empService, INotificationManager notifService, IUserNotificationManager userNotifService
            //MARC SO Revision 06042024
            , ISalesInvoiceManager siManager, IDeliveryReceiptManager drManager
            )
        {
            _orderManager = ordermanager;
            _orderItemManager = orderitemmanager;
            _orderChargeManager = orderchargemanager;
            _seriesTypeManager = seriestypemanager;
            _quotationManager = quotationmanager;
            _clientManager = clientManager;
            _warehouseManager = warehouseManager;
            _stockEntryCardManager = stockEntryCardManager;
            //MARC LEEPE 12182022 notifications
            _notifService = notifService;
            _userNotifService = userNotifService;
            _empService = empService;

            //MARC SO Revision 06042024
            _siManager = siManager;
            _drManager = drManager;
        }
        //Sales Order 
        public async Task<CreateSalesOrderOutput> CreateSalesOrder(CreateSalesOrderInput input)
        {
            try
            {

                //quotation
                if (input.salesorder.QuotationId != 0)
                {
                    var quotation = await _quotationManager.GetByIdAsync(input.salesorder.QuotationId);
                    if (quotation.StatusId != 6)
                    {
                        CreateSalesOrderOutput notforOrder = new CreateSalesOrderOutput();
                        notforOrder.SalesOrder = new GetSalesOrderOutput();
                        //set to return 0 id for notif object
                        notforOrder.Notif = new GetNotificationOutput();
                        return notforOrder;
                    }
                    quotation.StatusId = 4;
                    CheckErrors(await _quotationManager.UpdateAsync(quotation));
                }
                //quotation

                //series
                var seriestype = await _seriesTypeManager.GetByIdAsync(input.salesorder.SeriesTypeId);
                int nextseries = seriestype.LastSeries + 1;
                string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
                seriestype.LastSeries = nextseries;
                CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
                input.salesorder.Code = seriescode;
                //series

                //warehouse
                var warehouse = new Warehouse
                {
                    Abbr = input.salesorder.Code,
                    Name = input.salesorder.Code,
                    Description = "Temporary warehouse for " + input.salesorder.Code,
                    IsTemp = true,
                    IsMain = false
                };
                CheckErrors(await _warehouseManager.CreateAsync(warehouse));
                input.salesorder.DefaultDestinationId = warehouse.Id;
                //warehouse

                //client status
                var updateclientstatus = await _clientManager.GetByIdAsync(input.salesorder.ClientId);
                if (updateclientstatus.StatusId != 4)
                {
                    updateclientstatus.StatusId = 4;

                    CheckErrors(await _clientManager.UpdateAsync(updateclientstatus));
                }
                SalesOrder orderoutput = Mapper.Map<SalesOrder>(input.salesorder);
                CheckErrors(await _orderManager.CreateAsync(orderoutput));
                
                foreach (SalesOrderItemInput item in input.salesorderitems)
                {
                    item.SalesOrderId = orderoutput.Id;
                    SalesOrderItem orderitemoutput = Mapper.Map<SalesOrderItem>(item);
                    CheckErrors(await _orderItemManager.CreateAsync(orderitemoutput));
                    //Closed by Wilson
                    //source
                    var soItemId = 0;
                    do
                    {
                        soItemId = orderitemoutput.Id;
                    } while (soItemId <= 0);
                    var sqty = (decimal)orderitemoutput.OrderQty;
                    sqty = sqty * -1;
                    if (sqty != 0)
                    {
                        var stockcard = new StockCard
                        {
                            TransactionCode = input.salesorder.Code,
                            TransactionTypeId = seriestype.TransactionId,
                            TransactionId = orderitemoutput.SalesOrderId,
                            TransactionItemId = orderitemoutput.Id,
                            TransactionTime = input.salesorder.TransactionTime,
                            ProductId = orderitemoutput.ProductId,
                            Qty = sqty,
                            UnitId = orderitemoutput.UnitId,
                            WarehouseId = input.salesorder.DefaultSourceId
                        };
                        CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                    }

                    //destination
                    var dqty = (decimal)orderitemoutput.OrderQty;
                    if (dqty != 0)
                    {
                        var stockcard = new StockCard
                        {
                            TransactionCode = input.salesorder.Code,
                            TransactionTypeId = seriestype.TransactionId,
                            TransactionId = orderitemoutput.SalesOrderId,
                            TransactionItemId = orderitemoutput.Id,
                            TransactionTime = input.salesorder.TransactionTime,
                            ProductId = orderitemoutput.ProductId,
                            Qty = dqty,
                            UnitId = orderitemoutput.UnitId,
                            WarehouseId = input.salesorder.DefaultDestinationId
                        };
                        CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                    }
                    //Closed by Wilson
                }
                foreach (SalesOrderChargeInput charge in input.salesordercharges)
                {
                    charge.SalesOrderId = orderoutput.Id;
                    SalesOrderCharge orderchargeoutput = Mapper.Map<SalesOrderCharge>(charge);
                    CheckErrors(await _orderChargeManager.CreateAsync(orderchargeoutput));
                }

                CreateSalesOrderOutput create = new CreateSalesOrderOutput();
                create.SalesOrder = Mapper.Map<GetSalesOrderOutput>(orderoutput);
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
                empInput.Id = orderoutput.SalesAgentId;

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

                //check if there are users then create notification object and usernotif objects
                if (userids.Count() > 0)
                {
                    CreateNotificationInput nd = new CreateNotificationInput();
                    nd.Message = String.Format(L("NewOrder"), orderoutput.Code);
                    nd.TransactionCode = orderoutput.Code;
                    nd.TransactionId = orderoutput.Id;
                    nd.Action = "SalesOrders";
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
            catch (Exception ex)
            {
                CreateSalesOrderOutput exception = new CreateSalesOrderOutput();
                exception.SalesOrder = new GetSalesOrderOutput();
                //set to return 0 id for notif object
                exception.Notif = new GetNotificationOutput();
                return exception;
            }
        }
        public async Task<GetSalesOrderOutput> GetSalesOrder(GetSalesOrderInput input)
        {
            var getbyid = await _orderManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetSalesOrderOutput>(getbyid);
        }

        public async Task<PagedResultDto<SalesOrderOutput>> GetSalesOrders(GetSalesOrdersInput input)
        {
            var resultList = await _orderManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount,  input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<SalesOrderOutput>(listcount, ObjectMapper.Map<List<SalesOrderOutput>>(resultList));
        }



        public async Task<CreateSalesOrderOutput> UpdateSalesOrder(UpdateSalesOrderInput input)
        {
            try
            {
                SalesOrder orderoutput = Mapper.Map<SalesOrder>(input.salesorder);
                SalesOrder createorder = Mapper.Map<SalesOrder>(input.salesorder);
                var returnint = 0;

                CreateSalesOrderOutput update = new CreateSalesOrderOutput();
                //set to return 0 id for notif object
                update.Notif = new GetNotificationOutput();

                if (orderoutput.StatusId == 7)
                {
                    if (IsGranted(PermissionNames.Pages_Sales_Orders_Revision))
                    {
                        var updateorderstatus = await _orderManager.GetByIdAsync(orderoutput.Id);
                        updateorderstatus.StatusId = 7;

                        CheckErrors(await _orderManager.UpdateAsync(updateorderstatus));

                        createorder.Id = 0;
                        createorder.RevisionNo = createorder.RevisionNo + 1;
                        createorder.StatusId = orderoutput.StatusPreRevision;
                        createorder.StatusPreRevision = 0;
                        createorder.RevisionReason = "";
                        
                        CheckErrors(await _orderManager.CreateAsync(createorder));
                        returnint = createorder.Id;
                        
                        //Add change salesorderid of Ssales Invoice and Delivery receipt
                        var getDrs = await _drManager.GetAllList("null|null|null|null|null|null|null|null|null|" + updateorderstatus.Id, "", 0, 0, true);
                        foreach (var item in getDrs)
                        {
                            item.SalesOrderId = createorder.Id;
                            await _drManager.UpdateAsync(item);
                        }

                        var getSis = await _siManager.GetAllList("null|null|null|null|null|null|" + updateorderstatus.Id, "", 0, 0, true);
                        foreach(var item in getSis)
                        {
                            item.SalesOrderId = createorder.Id;
                            await _siManager.UpdateAsync(item);
                        }

                        var seriestype = await _seriesTypeManager.GetByIdAsync(input.salesorder.SeriesTypeId);

                        int oldSOId = orderoutput.Id;
                        
                        var soStockCardsOutput = await _stockEntryCardManager.GetAllList("null|" + seriestype.TransactionId + "|" + oldSOId + "|null|null|null|null|null|null|null|null", "", 0, 10, true);
                        if (soStockCardsOutput.Count() > 0)
                        {
                            //delete all stock card
                            foreach (var card in soStockCardsOutput.Cast<StockCard>().ToList())
                            {
                                await _stockEntryCardManager.DeleteAsync(card.Id);
                            }

                        }

                        foreach (SalesOrderItemInput item in input.salesorderitems)
                        {
                            item.SalesOrderId = returnint;
                            SalesOrderItem orderitemoutput = Mapper.Map<SalesOrderItem>(item);
                            orderitemoutput.Id = 0;
                            orderitemoutput.SalesOrderId = createorder.Id;

                            //var stockCardsOutput = await _stockEntryCardManager.GetAllList("null|" + seriestype.TransactionId + "|" + oldSOId + "|" + item.Id + "|null|null|null|null|null|null|null", "", 0, 10, false);
                            //List<StockCard> stockCards = stockCardsOutput.Cast<StockCard>().ToList();

                            CheckErrors(await _orderItemManager.CreateAsync(orderitemoutput));

                            //if stock cards == 2 
                            //update stock card to new so id and new so item id
                            //if (stockCards.Count == 2)
                            //{
                            //    for (int i = 0; i < stockCards.Count; i++) //StockCard card in stockCards)
                            //    {
                            //        StockCard card = stockCards[i];
                            //        if (i == 0)
                            //        {
                            //            var sqty = (decimal)item.OrderQty * -1;
                            //            card.WarehouseId = input.salesorder.DefaultSourceId;
                            //            card.Qty = sqty;
                            //            //new so id
                            //            card.TransactionId = orderitemoutput.SalesOrderId;
                            //            card.TransactionItemId = orderitemoutput.Id;
                            //        }
                            //        else
                            //        {
                            //            var dqty = (decimal)item.OrderQty;
                            //            card.WarehouseId = input.salesorder.DefaultDestinationId;
                            //            card.Qty = dqty;
                            //            //new so id
                            //            card.TransactionId = orderitemoutput.SalesOrderId;
                            //            card.TransactionItemId = orderitemoutput.Id;
                            //        }
                            //        CheckErrors(await _stockEntryCardManager.UpdateAsync(card));
                            //    }
                            //}
                            //else
                            //{
                                //create new stock cards
                                //source
                                var sqty = (decimal)orderitemoutput.OrderQty;
                                sqty = sqty * -1;
                                if (sqty != 0)
                                {
                                    var stockcard = new StockCard
                                    {
                                        TransactionCode = input.salesorder.Code,
                                        TransactionTypeId = seriestype.TransactionId,
                                        TransactionId = orderitemoutput.SalesOrderId,
                                        TransactionItemId = orderitemoutput.Id,
                                        TransactionTime = input.salesorder.TransactionTime,
                                        ProductId = orderitemoutput.ProductId,
                                        Qty = sqty,
                                        UnitId = orderitemoutput.UnitId,
                                        WarehouseId = input.salesorder.DefaultSourceId
                                    };
                                    CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                                }

                                //destination
                                var dqty = (decimal)orderitemoutput.OrderQty;
                                if (dqty != 0)
                                {
                                    var stockcard = new StockCard
                                    {
                                        TransactionCode = input.salesorder.Code,
                                        TransactionTypeId = seriestype.TransactionId,
                                        TransactionId = orderitemoutput.SalesOrderId,
                                        TransactionItemId = orderitemoutput.Id,
                                        TransactionTime = input.salesorder.TransactionTime,
                                        ProductId = orderitemoutput.ProductId,
                                        Qty = dqty,
                                        UnitId = orderitemoutput.UnitId,
                                        WarehouseId = input.salesorder.DefaultDestinationId
                                    };
                                    CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                                }
                            //}
                        }

                        foreach (SalesOrderChargeInput charge in input.salesordercharges)
                        {
                            charge.SalesOrderId = orderoutput.Id;
                            SalesOrderCharge orderchargeoutput = Mapper.Map<SalesOrderCharge>(charge);
                            orderchargeoutput.Id = 0;
                            orderchargeoutput.SalesOrderId = createorder.Id;

                            CheckErrors(await _orderChargeManager.CreateAsync(orderchargeoutput));
                        }
                        //MARC 01062023 new return
                        update.SalesOrder = Mapper.Map<GetSalesOrderOutput>(createorder);
                    }
                }
                else
                {

                    CheckErrors(await _orderManager.UpdateAsync(orderoutput));

                    var seriestype = await _seriesTypeManager.GetByIdAsync(input.salesorder.SeriesTypeId);

                    foreach (SalesOrderItemInput item in input.salesorderitems)
                    {
                        item.SalesOrderId = orderoutput.Id;
                        SalesOrderItem orderitemoutput = Mapper.Map<SalesOrderItem>(item);

                        var stockCardsOutput = await _stockEntryCardManager.GetAllList("null|" + seriestype.TransactionId + "|" + item.SalesOrderId + "|" + item.Id + "|null|null|null|null|null|null|null", "", 0, 10, true);
                        if(stockCardsOutput.Count() <= 0)
                        {
                            stockCardsOutput = await _stockEntryCardManager.GetAllList("null|" + seriestype.TransactionId + "|" + item.SalesOrderId + "|null|null|null|null|null|" + item.ProductId + "|null|null", "", 0, 10, true);
                        }
                        List<StockCard> stockCards = stockCardsOutput.Cast<StockCard>().ToList();

                        if (item.IsDeleted == true)
                        {
                            CheckErrors(await _orderItemManager.DeleteAsync(orderitemoutput.Id));

                            foreach (StockCard card in stockCards)
                            {
                                CheckErrors(await _stockEntryCardManager.DeleteAsync(card.Id));
                            }
                        }
                        else
                        {
                            if (item.Id > 0)
                            {
                                CheckErrors(await _orderItemManager.UpdateAsync(orderitemoutput));

                                for (int i = 0; i < stockCards.Count; i++) //StockCard card in stockCards)
                                {
                                    StockCard card = stockCards[i];
                                    if (i == 0)
                                    {
                                        var sqty = (decimal)item.OrderQty * -1;
                                        card.WarehouseId = input.salesorder.DefaultSourceId;
                                        card.TransactionItemId = orderitemoutput.Id;
                                        card.Qty = sqty;
                                    }
                                    else
                                    {
                                        var dqty = (decimal)item.OrderQty;
                                        card.WarehouseId = input.salesorder.DefaultDestinationId;
                                        card.TransactionItemId = orderitemoutput.Id;
                                        card.Qty = dqty;
                                    }
                                    CheckErrors(await _stockEntryCardManager.UpdateAsync(card));
                                }
                            }
                            else
                            {
                                CheckErrors(await _orderItemManager.CreateAsync(orderitemoutput));

                                //source
                                var sqty = (decimal)item.OrderQty;
                                sqty = sqty * -1;
                                if (sqty != 0)
                                {
                                    var stockcard = new StockCard
                                    {
                                        TransactionCode = input.salesorder.Code,
                                        TransactionTypeId = seriestype.TransactionId,
                                        TransactionId = orderitemoutput.SalesOrderId,
                                        TransactionItemId = orderitemoutput.Id,
                                        TransactionTime = input.salesorder.TransactionTime,
                                        ProductId = orderitemoutput.ProductId,
                                        Qty = sqty,
                                        UnitId = orderitemoutput.UnitId,
                                        WarehouseId = input.salesorder.DefaultSourceId
                                    };
                                    CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                                }

                                //destination
                                var dqty = (decimal)item.OrderQty;
                                if (dqty != 0)
                                {
                                    var stockcard = new StockCard
                                    {
                                        TransactionCode = input.salesorder.Code,
                                        TransactionTypeId = seriestype.TransactionId,
                                        TransactionId = orderitemoutput.SalesOrderId,
                                        TransactionItemId = orderitemoutput.Id,
                                        TransactionTime = input.salesorder.TransactionTime,
                                        ProductId = orderitemoutput.ProductId,
                                        Qty = dqty,
                                        UnitId = orderitemoutput.UnitId,
                                        WarehouseId = input.salesorder.DefaultDestinationId
                                    };
                                    CheckErrors(await _stockEntryCardManager.CreateAsync(stockcard));
                                }
                            }
                        }
                    }

                    foreach (SalesOrderChargeInput charge in input.salesordercharges)
                    {
                        charge.SalesOrderId = orderoutput.Id;
                        SalesOrderCharge orderchargeoutput = Mapper.Map<SalesOrderCharge>(charge);
                        if (charge.IsDeleted == true)
                        {
                            CheckErrors(await _orderChargeManager.DeleteAsync(orderchargeoutput.Id));
                        }
                        else
                        {
                            if (charge.Id > 0)
                            {
                                CheckErrors(await _orderChargeManager.UpdateAsync(orderchargeoutput));
                            }
                            else
                            {
                                CheckErrors(await _orderChargeManager.CreateAsync(orderchargeoutput));
                            }
                        }
                    }
                    update.SalesOrder = Mapper.Map<GetSalesOrderOutput>(orderoutput);
                }

               

                if (orderoutput.StatusId > 1)
                {
                    #region notifications

                    #region notif v1
                    //if (orderoutput.StatusId == 2)
                    //{
                    //    CreateNotificationInput nd = new CreateNotificationInput();
                    //    nd.Message = String.Format(L("SubmitOrder"), orderoutput.Code);
                    //    nd.TransactionCode = orderoutput.Code;
                    //    nd.TransactionId = orderoutput.Id;
                    //    nd.Action = "SalesOrder";
                    //    Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                    //    CheckErrors(await _notifService.CreateAsync(ntf));
                    //    var getntf = await _notifService.GetByIdAsync(ntf.Id);

                    //    CreateUserNotificationInput und = new CreateUserNotificationInput();

                    //    //permission notif
                    //    GetUserNotificationsInput upi = new GetUserNotificationsInput();
                    //    upi.Filter = "Pages.Sales.Orders.ForDelivery";
                    //    var up = await _userNotifService.GetUsersByPermissionList(upi.Filter, "");
                    //    var upe = Mapper.Map<List<GetEmployeeOutput>>(up);
                    //    foreach (GetEmployeeOutput users in upe)
                    //    {
                    //        string[] uids = getntf.UserIds.Split(',');
                    //        if (users.UserId != (int)AbpSession.UserId && !uids.Contains(users.UserId.ToString()))
                    //        {
                    //            und = new CreateUserNotificationInput();
                    //            und.NotificationId = ntf.Id;
                    //            und.UserId = users.UserId;
                    //            und.State = 0;
                    //            und.CreationTime = DateTime.Now;
                    //            UserNotification untf = Mapper.Map<UserNotification>(und);
                    //            await _userNotifService.CreateAsync(untf);
                    //            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? users.UserId.ToString() : "," + users.UserId.ToString();
                    //        }
                    //    }


                    //    update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                    //}
                    //if (orderoutput.StatusId == 3)
                    //{
                    //    //notifications
                    //    CreateNotificationInput nd = new CreateNotificationInput();
                    //    nd.Message = String.Format(L("ForDeliveryOrder"), orderoutput.Code);
                    //    nd.TransactionCode = orderoutput.Code;
                    //    nd.TransactionId = orderoutput.Id;
                    //    nd.Action = "SalesOrder";
                    //    Notification.Models.Notification ntf = Mapper.Map<Notification.Models.Notification>(nd);
                    //    CheckErrors(await _notifService.CreateAsync(ntf));
                    //    var getntf = await _notifService.GetByIdAsync(ntf.Id);

                    //    CreateUserNotificationInput und = new CreateUserNotificationInput();
                    //    //agent notif
                    //    GetEmployeeInput empInput = new GetEmployeeInput();
                    //    if (orderoutput.SalesAgentId > 0)
                    //    {
                    //        empInput.Id = orderoutput.SalesAgentId;
                    //        var emp = await _empService.GetEmployee(empInput);
                    //        if (emp.UserId != (int)AbpSession.UserId)
                    //        {
                    //            und.NotificationId = ntf.Id;
                    //            und.UserId = emp.UserId;
                    //            und.State = 0;
                    //            und.CreationTime = DateTime.Now;
                    //            getntf.UserIds = und.UserId.ToString();
                    //            UserNotification untf = Mapper.Map<UserNotification>(und);
                    //            await _userNotifService.CreateAsync(untf);
                    //        }
                    //    }

                    //    //permission notif
                    //    GetUserNotificationsInput upi = new GetUserNotificationsInput();
                    //    upi.Filter = "Pages.Delivery.Receipt.Create";
                    //    var up = await _userNotifService.GetUsersByPermissionList(upi.Filter, "");
                    //    var upe = Mapper.Map<List<GetEmployeeOutput>>(up);
                    //    foreach (GetEmployeeOutput users in upe)
                    //    {
                    //        string[] uids = getntf.UserIds.Split(',');
                    //        if (users.UserId != (int)AbpSession.UserId && !uids.Contains(users.UserId.ToString()))
                    //        {
                    //            und = new CreateUserNotificationInput();
                    //            und.NotificationId = ntf.Id;
                    //            und.UserId = users.UserId;
                    //            und.State = 0;
                    //            und.CreationTime = DateTime.Now;
                    //            UserNotification untf = Mapper.Map<UserNotification>(und);
                    //            await _userNotifService.CreateAsync(untf);
                    //            getntf.UserIds += string.IsNullOrEmpty(getntf.UserIds) ? users.UserId.ToString() : "," + users.UserId.ToString();
                    //        }
                    //    }


                    //    update.Notif = Mapper.Map<GetNotificationOutput>(getntf);
                    //}
                    #endregion notif v1

                    //get user ids first
                    List<long> userids = new List<long>();
                    string ndMess = "";
                    if (orderoutput.StatusId == 2)
                    {
                        userids = new List<long>();
                        ndMess = String.Format(L("SubmitOrder"), orderoutput.Code);

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
                    if (orderoutput.StatusId == 3)
                    {
                        userids = new List<long>();
                        ndMess = String.Format(L("ForDeliveryOrder"), orderoutput.Code);

                        //ae notif
                        GetEmployeeInput empInput = new GetEmployeeInput();
                        if (orderoutput.SalesAgentId > 0)
                        {
                            empInput.Id = orderoutput.SalesAgentId;
                            var emp = await _empService.GetEmployee(empInput);
                            if (emp.UserId > 0 && emp.UserId != (int)AbpSession.UserId)
                            {
                                userids.Add(emp.UserId);
                            }
                            //ae manager notif
                            if(emp.ManagerId > 0)
                            {
                                empInput.Id = orderoutput.SalesAgentId;
                                var mngr = await _empService.GetEmployee(empInput);
                                if (mngr.UserId > 0 && mngr.UserId != (int)AbpSession.UserId && !userids.Contains(mngr.UserId))
                                {
                                    userids.Add(mngr.UserId);
                                }
                            }
                        }

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
                        nd.TransactionCode = orderoutput.Code;
                        nd.TransactionId = orderoutput.Id;
                        nd.Action = "SalesOrders";
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
                return update;
                //return orderoutput.Id;
            }
            catch (Exception ex)
            {
                CreateSalesOrderOutput exception = new CreateSalesOrderOutput();
                exception.SalesOrder = new GetSalesOrderOutput();
                //set to return 0 id for notif object
                exception.Notif = new GetNotificationOutput();
                return exception;
            }
        }

        //Sales Order Items
        public async Task<PagedResultDto<SalesOrderItemOutput>> GetSalesOrderItemsByParentId(GetSalesOrderInput input)
        {
            var resultList = await _orderItemManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<SalesOrderItemOutput>(listcount, ObjectMapper.Map<List<SalesOrderItemOutput>>(resultList));
        }

        public async Task<PagedResultDto<SalesOrderChargeOutput>> GetSalesOrderChargesByParentId(GetSalesOrderInput input)
        {
            var resultList = await _orderChargeManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<SalesOrderChargeOutput>(listcount, ObjectMapper.Map<List<SalesOrderChargeOutput>>(resultList));
        }

        public async Task<PagedResultDto<SalesOrderOutput>> GetSalesOrderReport(GetTasksListInput input)
        {
            var resultList = await _orderManager.GetSalesOrderReportListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<SalesOrderOutput>(listcount, ObjectMapper.Map<List<SalesOrderOutput>>(resultList));
        }

        public async Task<PagedResultDto<SalesOrderOutput>> UpdateTPC(GetRFQListInput input)
        {
            var resultList = await _orderManager.UpdateTpcasync(input.Filter);
            int listcount = 0;
            return new PagedResultDto<SalesOrderOutput>(listcount, ObjectMapper.Map<List<SalesOrderOutput>>(resultList));
        }

        public async Task<PagedResultDto<SalesOrderOutput>> UpdateQDiscount(GetRFQListInput input)
        {
            var resultList = await _orderManager.UpdateQDiscountAync(input.Filter);
            int listcount = 0;
            return new PagedResultDto<SalesOrderOutput>(listcount, ObjectMapper.Map<List<SalesOrderOutput>>(resultList));
        }

        public async Task<PagedResultDto<SalesOrderOutput>> SalesorderSummaryAgentIdAsync(GetSalesOrdersInput input)
        {
            var resultList = await _orderManager.GetSalesorderSummaryAgentId(input.Filter);
            int listcount = 0;           
            return new PagedResultDto<SalesOrderOutput>(listcount, ObjectMapper.Map<List<SalesOrderOutput>>(resultList));
        }

        public async Task<GetSalesOrderOutput> AgentDivision(GetSalesOrderInput input)
        {
            var getbyid = await _orderManager.GetSalesorderAgentDivision(input.Id);
            return Mapper.Map<GetSalesOrderOutput>(getbyid);
        }


        public async Task<PagedResultDto<SalesOrderOutput>> Dashboard(GetSalesOrdersInput input)
        {
            var resultList = await _orderManager.GetDashboardListAsync(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<SalesOrderOutput>(listcount, ObjectMapper.Map<List<SalesOrderOutput>>(resultList));
        }

        public async Task<IEnumerable<SalesOrderOutput>> GetSORevisions(GetSalesOrdersInput input)
        {
            var resultList = await _orderManager.GetAllRevisionList(input.Filter, input.Sorting);
            //int listcount = 0;
            //if (resultList.Count() > 0)
            //{
            //    listcount = resultList.First().TotalRows;
            //}
            return Mapper.Map<List<SalesOrderOutput>>(resultList);
        }
    }
}
