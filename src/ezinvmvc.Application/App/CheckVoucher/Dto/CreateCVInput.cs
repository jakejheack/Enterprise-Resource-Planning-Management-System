using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.CheckVoucher.Dto
{
    public class CreateCVInput : FullAuditedEntity<int>
    {
        public CVInput CV { get; set; }
        public List<CVDInput> CVD { get; set; }
        public List<GeneralLedgerInput> generalledger { get; set; }
    }
}
