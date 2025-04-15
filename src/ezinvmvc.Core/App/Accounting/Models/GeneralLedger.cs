using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Accounting
{
   [Table("AppGeneralLedger")]
    public class GeneralLedger : FullAuditedEntity<int>
    {
        [Required]
        public int TransactionTypeId { get; set; }

        [Required]
        public int TransactionId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string TransactionCode { get; set; }

        [Required]
        public DateTime TransactionTime { get; set; }

        [Required]
        public int AccountId { get; set; }

        [Required]
        public decimal Debit { get; set; }

        [Required]
        public decimal Credit { get; set; }

        [Required]
        public int BaseTypeId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght1024, ErrorMessage = ezinvmvcConsts.ErrorMessage1024)]
        public string Description { get; set; }

        [Required]
        public int CenterTypeId { get; set; }

        [Required]
        public int PartyId { get; set; }

        [Required]
        public int PartyCode { get; set; }
        
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        public string PartyName { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int CompanyId { get; set; }

        [NotMapped]
        public string Account { get; set; }

        [NotMapped]
        public string BaseType { get; set; }

        [NotMapped]
        public string CenterType { get; set; }

        [NotMapped]
        public string PartyType { get; set; }

        [NotMapped]
        public string TransactionType { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public int tt_key { get; set; }

        [NotMapped]
        public int tt_parent { get; set; }
    }
}
