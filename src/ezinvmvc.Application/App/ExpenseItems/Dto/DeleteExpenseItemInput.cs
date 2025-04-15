using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.ExpenseItems.Dto
{
    public class DeleteExpenseItemInput : FullAuditedEntityDto<int>
    {
        public string Code { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }

        public int ExpenseAccountId { get; set; }

        [NotMapped]
        public string ExpenseAccount { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
