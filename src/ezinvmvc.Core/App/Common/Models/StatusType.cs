using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common
{
    [Table("AppStatusTypes")]
    public class StatusType: Entity<int>
    {
        public int Code { get; set; }
        public string Status { get; set; }
        public int TransactionCode { get; set; }
    }
}
