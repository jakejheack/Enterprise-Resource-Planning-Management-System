using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Products.Dto
{
    public class GetProductUnitOutput : Entity<int>
    {
        public int ProductId { get; set; }
        public int UnitId { get; set; }
        public decimal Conversion { get; set; }

        [NotMapped]
        public string Unit { get; set; }

        [NotMapped]
        public int DefaultUnitId { get; set; }
        
    }
}
