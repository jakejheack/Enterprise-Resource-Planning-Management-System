using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.RequestForPayment.Dto
{
   public class UpdateRFPInput : FullAuditedEntity<int>
    {
        public RFPInput RFP { get; set; }
        public List<RFPItemInput> RFPItems { get; set; }
        public List<GeneralLedgerInput> generalledger { get; set; }
    }
}
