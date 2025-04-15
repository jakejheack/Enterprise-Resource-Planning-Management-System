using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.CashVoucher.Dto
{
    public class CashVoucherOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int PartyId { get; set; }

        public string PartyCode { get; set; }

        public string PartyType { get; set; }

        public int ProjectId { get; set; }

        public int StatusId { get; set; }

        public string Notes { get; set; }

        public decimal PaymentAmount { get; set; }

        public string CheckName { get; set; }

        public string CheckNumber { get; set; }

        public DateTime CheckDate { get; set; }

        //Not Mapped

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string Name { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public int Totaldebit { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
