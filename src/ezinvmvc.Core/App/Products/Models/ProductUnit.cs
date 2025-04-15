using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ezinvmvc.App.Products
{
    [Table("AppProductUnits")]

    public class ProductUnit : Entity<int>
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int UnitId { get; set; }
        [Required]
        public decimal Conversion { get; set; }

        [NotMapped]
        public string Unit { get; set; }

        [NotMapped]
        public int DefaultUnitId { get; set; }

    }
}
