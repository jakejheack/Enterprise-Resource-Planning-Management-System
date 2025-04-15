using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ezinvmvc.App.Stocks
{
    [Table("AppStockMovement")]
    public class StockMovement : Entity<int>
    {
        public int TransactionId { get; set; }
        public string TransactionType { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int WarehouseId { get; set; }
    }
}
