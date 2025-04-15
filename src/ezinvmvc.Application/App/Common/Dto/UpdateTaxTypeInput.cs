using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common.Dto
{
    public class UpdateTaxTypeInput : Entity<int>
    {
        public TaxTypeInput taxtype { get; set;}
    }
}
