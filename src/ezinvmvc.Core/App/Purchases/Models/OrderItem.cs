using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Purchases
{
    [Table("AppPurchaseOrderItems")]
    public class OrderItem : Entity<int>, ISoftDelete
    {
        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public string ProductCode { get; set; }

        public string ProductName { get; set; }

        public int Quantity { get; set; }

        public decimal Cost { get; set; }

        public decimal SubTotal { get; set; }

        public bool IsDeleted { get; set; }
    }
}
