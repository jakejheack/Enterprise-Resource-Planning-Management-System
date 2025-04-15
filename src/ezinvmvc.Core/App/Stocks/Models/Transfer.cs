using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Stocks
{
    [Table("AppTransfer")]
    public class Transfer : FullAuditedEntity<int>
    {
        public string TransferNo { get; set; }
        public string TransferType { get; set; }
        public string TransferTime { get; set; }
        public int FromWarehouseId { get; set; }
        public int ToWarehouseId { get; set; }
        public string Status { get; set; }
    }
}
