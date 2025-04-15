using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.CheckVoucher.Dto
{
    public class CVOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int RequestId { get; set; }

        public int ClientId { get; set; }

        public string Notes { get; set; }

        public int PaymentModeId { get; set; }

        public decimal PaymentAmount { get; set; }

        public int EWTTypeId { get; set; }

        public decimal EWTAmount { get; set; }

        public decimal GrandTotal { get; set; }

        public string CheckName { get; set; }

        public string CheckNumber { get; set; }

        public DateTime CheckDate { get; set; }

        public int PaymentAccountId { get; set; }

        public int DepositAccountId { get; set; }

        public int ReferenceTypeId { get; set; }

        public int StatusId { get; set; }

        public int ReferenceId { get; set; }

        public int ReferenceCode { get; set; }

        [NotMapped]
        public string PaymentMode { get; set; }

        [NotMapped]
        public string EWTType { get; set; }

        [NotMapped]
        public string Client { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public bool IsFullyPaid { get; set; }
        [NotMapped]
        public decimal Paid { get; set; }
        [NotMapped]
        public decimal Credit { get; set; }
        [NotMapped]
        public decimal Balance { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
