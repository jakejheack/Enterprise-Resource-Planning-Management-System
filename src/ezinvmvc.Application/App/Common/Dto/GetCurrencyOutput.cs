using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Common.Dto
{
    public class GetCurrencyOutput : Entity<int>
    {
        public string Name { get; set; }
        
        public char Sign { get; set; }
    }
}
