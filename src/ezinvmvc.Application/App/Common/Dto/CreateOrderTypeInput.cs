
using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common.Dto
{
    public class CreateOrderTypeInput: Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        public int CurrencyId { get; set; }

        [Required]
        public int ReceivableAccountId { get; set; }

        [Required]
        public int ReceivableAccountEntry { get; set; }

        [Required]
        public int SalesAccountId { get; set; }

        [Required]
        public int SalesAccountEntry { get; set; }

        [Required]
        public int SalesDiscountAccountId { get; set; }

        [Required]
        public int SalesDiscountAccountEntry { get; set; }

        [Required]
        public int SalesReturnAccountId { get; set; }

        [Required]
        public int SalesReturnAccountEntry { get; set; }

        [Required]
        public int TaxAccountId { get; set; }

        [Required]
        public int TaxAccountEntry { get; set; }

        [NotMapped]
        public string Currency { get; set; }
    }
}
