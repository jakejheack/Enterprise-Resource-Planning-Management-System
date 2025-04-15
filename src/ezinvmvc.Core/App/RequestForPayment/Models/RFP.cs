using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.RequestForPayment.Models
{
    [Table("AppRFP")]
    public class RFP : FullAuditedEntity<int>
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int SeriesTypeId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght8, ErrorMessage = ezinvmvcConsts.ErrorMessage8)]
        public string Prefix { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string Code { get; set; }

        [Required]
        public DateTime TransactionTime { get; set; }

        [Required]
        public int ClientId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string RequestCode { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght512, ErrorMessage = ezinvmvcConsts.ErrorMessage512)]
        public string Notes { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght1024, ErrorMessage = ezinvmvcConsts.ErrorMessage1024)]
        public string TermsAndConditions { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public int TaxTypeId { get; set; }

        [Required]
        public int PaymentTermId { get; set; }

        [Required]
        public decimal SubTotal { get; set; }

        [Required]
        public decimal NetTotal { get; set; }

        [Required]
        public decimal TaxRate { get; set; }

        [Required]
        public decimal Tax { get; set; }

        [Required]
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
