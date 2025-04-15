using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
    public class GetVehicleTypeOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
