using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Products
{
    [Table("AppCategories")]
    public class Category : Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }
    }
}
