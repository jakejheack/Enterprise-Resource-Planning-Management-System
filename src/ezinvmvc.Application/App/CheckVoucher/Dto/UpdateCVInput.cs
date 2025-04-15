using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.CheckVoucher.Dto
{
    public class UpdateCVInput : FullAuditedEntity<int>
    {
        public CVInput CV { get; set; }
        //public List<CVDInput> CVD { get; set; }
    }
}
