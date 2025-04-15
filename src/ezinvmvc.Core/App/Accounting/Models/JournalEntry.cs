using System;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Accounting
{
    [Table("AppJournalEntry")]
    public class JournalEntry : FullAuditedEntity<int>
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
        public int JournalTypeId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght1024, ErrorMessage = ezinvmvcConsts.ErrorMessage1024)]
        public string Notes { get; set; }

        //Not Mapped

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string JournalType { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public int Totaldebit { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
