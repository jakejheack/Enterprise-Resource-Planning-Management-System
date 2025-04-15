using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ezinvmvc.App.Stocks
{
    [Table("AppTransferDetails")]
    public class TransferDetails : Entity<int>, ISoftDelete
    {
        public int TransferId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int ItemNo { get; set; }
        public virtual bool IsDeleted { get; set; }
    }
}
