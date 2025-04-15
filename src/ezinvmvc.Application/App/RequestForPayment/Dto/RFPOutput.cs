using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.RequestForPayment.Dto
{
    public class RFPOutput : FullAuditedEntity<int>
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int ClientId { get; set; }

        public int RequestId { get; set; }

        public string RequestCode { get; set; }

        public string Notes { get; set; }

        public string TermsAndConditions { get; set; }

        public int StatusId { get; set; }

        public int TaxTypeId { get; set; }

        public int PaymentTermId { get; set; }

        public decimal SubTotal { get; set; }

        public decimal NetTotal { get; set; }

        public decimal TaxRate { get; set; }

        public decimal Tax { get; set; }

        public decimal GrandTotal { get; set; }

        [NotMapped]
        public string Company { get; set; }
        [NotMapped]
        public string Client { get; set; }
        [NotMapped]
        public string Agent { get; set; }
        [NotMapped]
        public string Status { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
