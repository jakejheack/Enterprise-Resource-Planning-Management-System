using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using AutoMapper;
using ezinvmvc.App.Accounting.Dto;
using ezinvmvc.App.Clients;
using ezinvmvc.App.Common;
using ezinvmvc.App.Sales;
using ezinvmvc.App.Sales.DTO;
using ezinvmvc.Authorization;

namespace ezinvmvc.App.Accounting
{
   [AbpAuthorize(PermissionNames.Pages_Collections)]
   public class CollectionService : ezinvmvcAppServiceBase, ICollectionService
    {
        private readonly ICollectionManager _collectionManager;
        private readonly ICollectionAppliedManager _collectionAppliedManager;
        private readonly IGeneralLedgerManager _generalLedgerManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly IClientManager _clientManager;
        private readonly ISalesInvoiceManager _invoiceManager;

        public CollectionService(ICollectionManager collectionManager, ICollectionAppliedManager collectionAppliedManager, IGeneralLedgerManager generalLedgerManager, ISeriesTypeManager seriesTypeManager, IClientManager clientManager, ISalesInvoiceManager invoiceManager)
        {
            _collectionManager = collectionManager;
            _collectionAppliedManager = collectionAppliedManager;
            _generalLedgerManager = generalLedgerManager;
            _seriesTypeManager = seriesTypeManager;
            _clientManager = clientManager;
            _invoiceManager = invoiceManager;
        }

        public async Task<int> CreateCollection(CreateCollectionInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.collection.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            //series
            input.collection.Code = seriescode;
            Collection output = Mapper.Map<Collection>(input.collection);
            CheckErrors(await _collectionManager.CreateAsync(output));

            foreach (CollectionAppliedInput item in input.collectionapplied)
            {
                ////update invoice if fully paid
                //var invoice = await _invoiceManager.GetByIdAsync(item.SalesInvoiceId);
                //if (item.IsFullyPaid)
                //{
                //    invoice.StatusId = 3;
                //    CheckErrors(await _invoiceManager.UpdateAsync(invoice));
                //}
                ////update invoice if fully paid

                item.CollectionId = output.Id;
                CollectionApplied itemoutput = Mapper.Map<CollectionApplied>(item);
                CheckErrors(await _collectionAppliedManager.CreateAsync(itemoutput));
            }

            //foreach (GeneralLedgerInput ledger in input.generalledger)
            //{
            //    ledger.TransactionId = output.Id;
            //    ledger.TransactionCode = seriescode;
            //    ledger.TransactionTypeId = seriestype.TransactionId;
            //    GeneralLedger orderitemoutput = Mapper.Map<GeneralLedger>(ledger);
            //    try
            //    {
            //        CheckErrors(await _generalLedgerManager.CreateAsync(orderitemoutput));
            //    }
            //    catch (Exception ex)
            //    { }
            //}
            await CurrentUnitOfWork.SaveChangesAsync();

            
            return output.Id;
        }

        public async Task<CollectionOutput> GetCollection(GetCollectionInput input)
        {
            var getbyid = await _collectionManager.GetByIdAsync(input.Id);
            return Mapper.Map<CollectionOutput>(getbyid);
        }

        public async Task<PagedResultDto<CollectionAppliedOutput>> GetCollectionAppliedByParentId(GetCollectionInput input)
        {
            var resultList = await _collectionAppliedManager.GetAllByParentId(input.Id);
            int listcount = 0;
            return new PagedResultDto<CollectionAppliedOutput>(listcount, ObjectMapper.Map<List<CollectionAppliedOutput>>(resultList));
        }

        public async Task<PagedResultDto<CollectionOutput>> GetCollections(GetCollectionsInput input)
        {
            var resultList = await _collectionManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<CollectionOutput>(listcount, ObjectMapper.Map<List<CollectionOutput>>(resultList));
        }

        public async Task<int> UpdateCollection(UpdateCollectionInput input)
        {
            Collection coloutput = Mapper.Map<Collection>(input.collection);

            if (coloutput.StatusId < 3)
            {
                CheckErrors(await _collectionManager.UpdateAsync(coloutput));
            }
            foreach (CollectionAppliedInput item in input.collectionapplied)
            {
                item.CollectionId = coloutput.Id;
                CollectionApplied itemoutput = Mapper.Map<CollectionApplied>(item);
                if (item.IsDeleted == true)
                {
                    CheckErrors(await _collectionAppliedManager.DeleteAsync(itemoutput.Id));
                }
                else
                {
                    if (item.Id > 0)
                    {
                        CheckErrors(await _collectionAppliedManager.UpdateAsync(itemoutput));
                    }
                    else
                    {
                        CheckErrors(await _collectionAppliedManager.CreateAsync(itemoutput));
                    }
                    if (coloutput.StatusId > 1)
                    {
                        //update invoice if fully paid
                        var invoice = await _invoiceManager.GetByIdAsync(item.SalesInvoiceId);
                        if (item.IsFullyPaid)
                        {
                            invoice.StatusId = 3;
                            CheckErrors(await _invoiceManager.UpdateAsync(invoice));
                        }
                        //update invoice if fully paid
                    }
                }
            }

            var seriestype = await _seriesTypeManager.GetByIdAsync(input.collection.SeriesTypeId);
            foreach (GeneralLedgerInput ledger in input.generalledger)
            {
                ledger.TransactionId = coloutput.Id;
                ledger.TransactionTypeId = seriestype.TransactionId;
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
            return coloutput.Id;
        }
    }
}
