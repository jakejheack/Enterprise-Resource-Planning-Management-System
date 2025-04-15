using System.Linq;
using System.Collections.Generic;
using Abp;

namespace ezinvmvc.App.Common
{
    public class ComponentsService : ezinvmvcAppServiceBase, IComponentsService
    {
        public List<NameValue<string>> GetOrdersStatus()
        {
            var status = new List<NameValue<string>>
            {
                new NameValue {Name = "Draft", Value = "1"},
                new NameValue {Name = "Ordered", Value = "2"},
                new NameValue {Name = "Partial", Value = "3"},
                new NameValue {Name = "Completed", Value = "4"}
            };
            return status.ToList();
        }
    }
}
