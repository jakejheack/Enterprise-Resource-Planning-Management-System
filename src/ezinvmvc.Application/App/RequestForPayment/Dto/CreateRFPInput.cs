using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.RequestForPayment.Dto
{
    public class CreateRFPInput : FullAuditedEntity<int>
    {
        public RFPInput RFP { get; set; }
        public List<RFPItemInput> RFPItems { get; set; }
    }
}
