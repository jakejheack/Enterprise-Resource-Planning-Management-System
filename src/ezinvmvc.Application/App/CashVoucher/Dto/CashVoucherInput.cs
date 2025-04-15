using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.CashVoucher.Dto
{
    public class CashVoucherInput : FullAuditedEntity<int>
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
        public int PartyId { get; set; }

        [Required]
        public string PartyCode { get; set; }

        [Required]
        public string PartyType { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght1024, ErrorMessage = ezinvmvcConsts.ErrorMessage1024)]
        public string Notes { get; set; }

        [Required]
        public decimal PaymentAmount { get; set; }

        [Required]
        public string CheckName { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght1024, ErrorMessage = ezinvmvcConsts.ErrorMessage1024)]
        public string CheckNumber { get; set; }

        [Required]
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
