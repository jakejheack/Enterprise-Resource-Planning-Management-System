using Abp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ezinvmvc.App.Common
{
    public class SeriesTypeService : ezinvmvcAppServiceBase, ISeriesTypeService
    {
        public List<NameValue<string>> GetAllList()
        {
            var series = new List<NameValue<string>>
            {
                new NameValue {Name = "Leads", Value = "1"}
            };
            return series.ToList();
        }
    }
}
