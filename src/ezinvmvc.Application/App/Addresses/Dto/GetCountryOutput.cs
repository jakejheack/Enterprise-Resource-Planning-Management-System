using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Addresses.Dto
{
    public class GetCountryOutput : Entity<int>
    {
        public string Code { get; set; }

        public string Name { get; set; }

        public bool IsDefault { get; set; }
    }
}
