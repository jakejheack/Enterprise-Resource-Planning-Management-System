using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Accounting;
using ezinvmvc.App.CheckVoucher.Dto;
using ezinvmvc.App.CheckVoucher.Models;
using ezinvmvc.App.Common;
using ezinvmvc.App.RequestForPayment;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CheckVoucher
{
    public class CVService : ezinvmvcAppServiceBase, ICVService
    {
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly ICVManager _cvManager;
        private readonly ICVDManager _cvdManager;
        private readonly IRFPManager _rfpManager;
        private readonly IGeneralLedgerManager _generalLedgerManager;

        public CVService(ICVManager cvManager, ISeriesTypeManager seriesTypeManager, ICVDManager cvdManager, IRFPManager rfpManager, IGeneralLedgerManager generalLedgerManager)
        {
            _rfpManager = rfpManager;
            _cvManager = cvManager;
            _cvdManager = cvdManager;
            _seriesTypeManager = seriesTypeManager;
            _generalLedgerManager = generalLedgerManager;
        }

        public async Task<int> CreateCV(CreateCVInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.CV.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.CV.Code = seriescode;
            //series
            CV output = Mapper.Map<CV>(input.CV);
            //if (output.IsFullyPaid)
            //{
            //    output.StatusId = 2;
            //}
            CheckErrors(await _cvManager.CreateAsync(output));
            

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        //public async Task<PagedResultDto<CVOutput>> GetAllbyDetails(GetCVListInput input)
        //{
        //    var resultList = await _cvManager.GetAllListbyDetails(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, false);
        //    int listcount = 0;
        //    //if (resultList.Count() > 0)
        //    //{
        //    //    listcount = resultList.First().TotalRows;
        //    //}
        //    return new PagedResultDto<CVOutput>(listcount, ObjectMapper.Map<List<CVOutput>>(resultList));
        //}

        public async Task<PagedResultDto<CVOutput>> GetAllCV(GetCVListInput input)
        {
            var resultList = await _cvManager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<CVOutput>(listcount, ObjectMapper.Map<List<CVOutput>>(resultList));
        }

        public async Task<PagedResultDto<APOutput>> GetAPs(GetAPListInput input)
        {
            var resultList = await _cvManager.GetAP(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<APOutput>(listcount, ObjectMapper.Map<List<APOutput>>(resultList));
        }

        public async Task<GetCVOutput> GetCV(GetCVInput input)
        {
            var getbyid = await _cvManager.GetByIdAsync(input.Id);
            return Mapper.Map<GetCVOutput>(getbyid);
        }

        public async Task<PagedResultDto<CVOutput>> GetCVByParentId(GetCVInput input)
        {
            var resultList = await _cvManager.GetAllByCVParentIdAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<CVOutput>(listcount, ObjectMapper.Map<List<CVOutput>>(resultList));
        }

        //public async Task<GetCVOutput> GetCVbyDetails(GetCVInput input)
        //{
        //    var getbyid = await _cvManager.GetByIdCVAsync(input.Id);
        //    return Mapper.Map<GetCVOutput>(getbyid);
        //}

        public async Task<PagedResultDto<CVDOutput>> GetCVItemByParentId(GetCVInput input)
        {
            var resultList = await _cvdManager.GetAllByParentIdAsync(input.Id);
            int listcount = 0;
            return new PagedResultDto<CVDOutput>(listcount, ObjectMapper.Map<List<CVDOutput>>(resultList));
        }

        public async Task<int> UpdateCV(CreateCVInput input)
        {
            CV output = Mapper.Map<CV>(input.CV);
            CheckErrors(await _cvManager.UpdateAsync(output));

            //foreach (CVDInput item in input.CVD)
            //{
            //    item.RequestId = output.Id;
            //    CVD itemoutput = Mapper.Map<CVD>(item);
            //    if (item.IsDeleted == true)
            //    {
            //        CheckErrors(await _cvdManager.DeleteAsync(itemoutput.Id));
            //    }
            //    else
            //    {
            //        if (item.Id > 0)
            //        {
            //            CheckErrors(await _cvdManager.UpdateAsync(itemoutput));
            //        }
            //        else
            //        {
            //            CheckErrors(await _cvdManager.CreateAsync(itemoutput));
            //        }
            //    }

            //}
            if (output.StatusId == 2)
            {
                //update RFP if fully paid
                var invoice = await _rfpManager.GetByIdAsync(output.RequestId);
                if (output.IsFullyPaid)
                {
                    invoice.StatusId = 3;
                    CheckErrors(await _rfpManager.UpdateAsync(invoice));
                }
                else
                {
                    invoice.StatusId = 2;
                    CheckErrors(await _rfpManager.UpdateAsync(invoice));
                }

                foreach (CVDInput item in input.CVD)
                {


                    item.RequestId = output.Id;
                    CVD itemoutput = Mapper.Map<CVD>(item);
                    CheckErrors(await _cvdManager.CreateAsync(itemoutput));
                }
                var seriestype = await _seriesTypeManager.GetByIdAsync(output.SeriesTypeId);
                foreach (GeneralLedgerInput ledger in input.generalledger)
                {
                    ledger.TransactionId = output.Id;
                    ledger.TransactionCode = output.Code;
                    ledger.TransactionTypeId = seriestype.TransactionId;
                    ledger.TransactionTime = System.DateTime.Now;
                    GeneralLedger orderitemoutput = Mapper.Map<GeneralLedger>(ledger);
                    try
                    {
                        CheckErrors(await _generalLedgerManager.CreateAsync(orderitemoutput));
                    }
                    catch (Exception ex)
                    { }
                }
            }

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }
    }
}
