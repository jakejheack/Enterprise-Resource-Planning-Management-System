using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.CheckVoucher.Models
{
    [Table("AppCheckVoucher")]
    public class CV : FullAuditedEntity<int>
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
        public int RequestId { get; set; }

        [Required]
        public int ClientId { get; set; }

        public string Notes { get; set; }

        [Required]
        public int PaymentModeId { get; set; }

        [Required]
        public decimal PaymentAmount { get; set; }

        [Required]
        public int EWTTypeId { get; set; }

        [Required]
        public decimal EWTAmount { get; set; }

        [Required]
        public decimal GrandTotal { get; set; }

        [Required]
        public string CheckName { get; set; }

        [Required]
        public string CheckNumber { get; set; }

        [Required]
        public DateTime CheckDate { get; set; }

        [Required]
        public int PaymentAccountId { get; set; }

        [Required]
        public int DepositAccountId { get; set; }

        [Required]
        public int ReferenceTypeId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public int ReferenceId { get; set; }

        [Required]
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
