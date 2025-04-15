using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
    public class GetWarehouseOutput : Entity<int>
    {
        public string Abbr { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsTemp { get; set; }

        public bool IsMain { get; set; }
    }
}
