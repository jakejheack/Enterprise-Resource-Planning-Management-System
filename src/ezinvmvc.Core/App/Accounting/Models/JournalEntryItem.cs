using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Accounting
{
    [Table("AppJournalEntryItem")]
    public class JournalEntryItem : FullAuditedEntity<int>
    {
        [Required]
        public int JournalEntryId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [Required]
        public decimal Debit { get; set; }

        [Required]
        public decimal Credit { get; set; }

        [Required]
        public int BaseTypeId { get; set; }

        [Required]
        public int Description { get; set; }

        [Required]
        public int CenterTypeId { get; set; }

        [Required]
        public int PartyId { get; set; }

        [Required]
        public string PartyCode { get; set; }

        [Required]
        public string PartyType { get; set; }

        [NotMapped]
        public string AccountName { get; set; }

        [NotMapped]
        public string Name { get; set; }
    }
}
