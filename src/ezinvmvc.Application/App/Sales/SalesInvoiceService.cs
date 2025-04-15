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
using ezinvmvc.App.Accounting;
using Abp.UI;

namespace ezinvmvc.App.Sales
{
    [AbpAuthorize(PermissionNames.Pages_Sales_Invoice)]
    public class SalesInvoiceService : ezinvmvcAppServiceBase, ISalesInvoiceService
    {
        private readonly ISalesInvoiceManager _invoiceManager;
        private readonly ISalesInvoiceItemManager _invoiceItemManager;
        private readonly ISalesInvoiceChargeManager _invoiceChargeManager;
        private readonly IGeneralLedgerManager _generalLedgerManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly ISalesOrderManager _orderManager;
        private readonly IClientManager _clientManager;

        public SalesInvoiceService(ISalesInvoiceManager invoiceManager, ISalesInvoiceItemManager invoiceItemManager, ISalesInvoiceChargeManager invoiceChargeManager, ISeriesTypeManager seriestypemanager, ISalesOrderManager orderManager, IClientManager clientManager, IGeneralLedgerManager generalLedgerManager)
        {
            _invoiceManager = invoiceManager;
            _invoiceItemManager = invoiceItemManager;
            _invoiceChargeManager = invoiceChargeManager;
            _generalLedgerManager = generalLedgerManager;
            _seriesTypeManager = seriestypemanager;
            _orderManager = orderManager;
            _clientManager = clientManager;
        }

        public async Task<int> CreateSalesInvoice(CreateSalesInvoiceInput input)
        {
            //quotation
            var salesorder = await _orderManager.GetByIdAsync(input.salesinvoice.SalesOrderId);
            //MARC 11142022 fix for delivery status
            //if (salesorder.StatusId != 2 && salesorder.StatusId != 3 && salesorder.StatusId != 4)
            if (salesorder.BillingStatusId > 2)
            {
                //return 0;
                throw new UserFriendlyException("Sales Order is fully billed!");
            }
            //salesorder.StatusId = 5;
            //CheckErrors(await _orderManager.UpdateAsync(salesorder));

            //var salesinvoice = await _invoiceManager.GetByIdAsync(input.salesinvoice.Id);
            var balance = salesorder.GrandTotal - (salesorder.BillGrandTotal + input.salesinvoice.BillGrandTotal);
            if(balance == 0)
            {
                salesorder.BillingStatusId = 3;
                CheckErrors(await _orderManager.UpdateAsync(salesorder));
            }
            else if (balance > 0 && balance < salesorder.GrandTotal)
            {
                salesorder.BillingStatusId = 2;
                CheckErrors(await _orderManager.UpdateAsync(salesorder));
            }
            else if(balance < 0)
            {
                throw new UserFriendlyException("Sales Order is over billed!\n Please refresh the page.");
            }

            //quotation
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.salesinvoice.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.salesinvoice.Code = seriescode;
            //series
           
            SalesInvoice output = Mapper.Map<SalesInvoice>(input.salesinvoice);
            CheckErrors(await _invoiceManager.CreateAsync(output));

            foreach (SalesInvoiceItemInput item in input.salesinvoiceitems)
            {
                item.SalesInvoiceId = output.Id;
                SalesInvoiceItem itemoutput = Mapper.Map<SalesInvoiceItem>(item);
                CheckErrors(await _invoiceItemManager.CreateAsync(itemoutput));
            }
            foreach (SalesInvoiceChargeInput charge in input.salesinvoicecharges)
            {
                charge.SalesInvoiceId = output.Id;
                SalesInvoiceCharge chargeoutput = Mapper.Map<SalesInvoiceCharge>(charge);
                CheckErrors(await _invoiceChargeManager.CreateAsync(chargeoutput));
            }
            try
            {
                await CurrentUnitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            { }
            return output.Id;
        }

        public async Task<SalesInvoiceOutput> GetSalesInvoice(GetSalesInvoiceInput input)
        {
            var getbyid = await _invoiceManager.GetByIdAsync(input.Id);
            return Mapper.Map<SalesInvoiceOutput>(getbyid);
        }

        public async Task<PagedResultDto<SalesInvoiceItemOutput>> GetSalesInvoiceItemsByParentId(GetSalesInvoiceInput input)
        {
            var resultList = await _invoiceItemManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<SalesInvoiceItemOutput>(listcount, ObjectMapper.Map<List<SalesInvoiceItemOutput>>(resultList));
        }

        public async Task<PagedResultDto<SalesInvoiceChargeOutput>> GetSalesInvoiceChargesByParentId(GetSalesInvoiceInput input)
        {
            var resultList = await _invoiceChargeManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<SalesInvoiceChargeOutput>(listcount, ObjectMapper.Map<List<SalesInvoiceChargeOutput>>(resultList));
        }
        public async Task<PagedResultDto<SalesInvoiceOutput>> GetSalesInvoices(GetSalesInvoicesInput input)
        {
            var resultList = await _invoiceManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<SalesInvoiceOutput>(listcount, ObjectMapper.Map<List<SalesInvoiceOutput>>(resultList));
        }
        public async Task<PagedResultDto<AccountsReceivableOutput>> GetAccountsReceivable(GetSalesInvoicesInput input)
        {
            input.MaxResultCount = 1000000;
            var resultList = await _invoiceManager.GetAR(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<AccountsReceivableOutput>(listcount, ObjectMapper.Map<List<AccountsReceivableOutput>>(resultList));
        }
        public async Task<int> UpdateSalesInvoice(UpdateSalesInvoiceInput input)
        {
            //check so billing status
            var salesorder = await _orderManager.GetByIdAsync(input.salesinvoice.SalesOrderId);
            var salesinvoice = await _invoiceManager.GetByIdAsync(input.salesinvoice.Id);
            var balance = salesinvoice.GrandTotal - (salesinvoice.BilledGrandTotal + input.salesinvoice.BillGrandTotal);
            if (input.salesinvoice.StatusId < 5)
            {
                if (balance == 0)
                {
                    salesorder.BillingStatusId = 3;
                    CheckErrors(await _orderManager.UpdateAsync(salesorder));
                }
                else if (balance > 0 && balance < salesorder.GrandTotal)
                {
                    salesorder.BillingStatusId = 2;
                    CheckErrors(await _orderManager.UpdateAsync(salesorder));
                }
                else if (balance < 0)
                {
                    throw new UserFriendlyException("Sales Order is over billed!\n Please refresh the page.");
                }
            }
            else
            {
                balance = salesinvoice.GrandTotal - salesinvoice.BilledGrandTotal;
                if (balance == 0)
                {
                    salesorder.BillingStatusId = 3;
                    CheckErrors(await _orderManager.UpdateAsync(salesorder));
                }
                else if (balance > 0 && balance < salesorder.GrandTotal)
                {
                    salesorder.BillingStatusId = 2;
                    CheckErrors(await _orderManager.UpdateAsync(salesorder));
                }
                else if (balance < 0)
                {
                    throw new UserFriendlyException("Sales Order is over billed!\n Please refresh the page.");
                }
            }
            //check so billing status

            SalesInvoice orderoutput = Mapper.Map<SalesInvoice>(input.salesinvoice);
            CheckErrors(await _invoiceManager.UpdateAsync(orderoutput));
            foreach (SalesInvoiceItemInput item in input.salesinvoiceitems)
            {
                item.SalesInvoiceId = orderoutput.Id;
                SalesInvoiceItem orderitemoutput = Mapper.Map<SalesInvoiceItem>(item);
                if (item.IsDeleted == true)
                {
                    CheckErrors(await _invoiceItemManager.DeleteAsync(orderitemoutput.Id));
                }
                else
                {
                    if (item.Id > 0)
                    {
                        CheckErrors(await _invoiceItemManager.UpdateAsync(orderitemoutput));
                    }
                    else
                    {
                        CheckErrors(await _invoiceItemManager.CreateAsync(orderitemoutput));
                    }
                }
            }
            foreach (SalesInvoiceChargeInput charge in input.salesinvoicecharges)
            {
                charge.SalesInvoiceId = orderoutput.Id;
                SalesInvoiceCharge orderitemoutput = Mapper.Map<SalesInvoiceCharge>(charge);
                if (charge.IsDeleted == true)
                {
                    CheckErrors(await _invoiceChargeManager.DeleteAsync(orderitemoutput.Id));
                }
                else
                {
                    if (charge.Id > 0)
                    {
                        CheckErrors(await _invoiceChargeManager.UpdateAsync(orderitemoutput));
                    }
                    else
                    {
                        CheckErrors(await _invoiceChargeManager.CreateAsync(orderitemoutput));
                    }
                }
            }

            var seriestype = await _seriesTypeManager.GetByIdAsync(input.salesinvoice.SeriesTypeId);

            //checks if ledger needs to be reversed
            if (salesinvoice.StatusId == 1 && input.salesinvoice.StatusId == 5)
            {
                input.generalledger = new List<GeneralLedgerInput>();
            }
            else if(salesinvoice.StatusId > 1 && input.salesinvoice.StatusId == 5)
            {

            }

            foreach (GeneralLedgerInput ledger in input.generalledger)
            {
                ledger.TransactionId = orderoutput.Id;
                ledger.TransactionTypeId = seriestype.TransactionId;
                ledger.TransactionTime = System.DateTime.Now;
                GeneralLedger orderitemoutput = Mapper.Map<GeneralLedger>(ledger);
                if (ledger.IsDeleted == true)
                {
                    CheckErrors(await _generalLedgerManager.DeleteAsync(orderitemoutput.Id));
                }
                else
                {
                    if (ledger.Id > 0)
                    {
                        CheckErrors(await _generalLedgerManager.UpdateAsync(orderitemoutput));
                    }
                    else
                    {
                        CheckErrors(await _generalLedgerManager.CreateAsync(orderitemoutput));
                    }
                }
            }

            await CurrentUnitOfWork.SaveChangesAsync();
            return orderoutput.Id;
        }

      
    }
}
