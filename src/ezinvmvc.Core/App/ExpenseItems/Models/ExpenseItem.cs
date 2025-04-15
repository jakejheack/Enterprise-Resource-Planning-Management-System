using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.ExpenseItems
{
    [Table("AppExpenseItems")]
    public class ExpenseItem : FullAuditedEntity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Name { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght3072, ErrorMessage = ezinvmvcConsts.ErrorMessage3072)]
        public string Description { get; set; }

        public int ExpenseAccountId { get; set; }

        [NotMapped]
        public string ExpenseAccount { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
