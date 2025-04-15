using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.CashVoucher.Dto
{
   public class CreateCashVoucherInput : FullAuditedEntity<int>
    {
        public CashVoucherInput CashVoucher { get; set; }
        public List<CashVoucherItemInput> CashVoucherItems { get; set; }
        
    }
}
