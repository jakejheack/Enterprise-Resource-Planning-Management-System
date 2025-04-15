using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
   public class GetTransportModeOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
