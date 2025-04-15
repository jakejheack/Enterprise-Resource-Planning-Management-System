using Abp.Runtime.Validation;
using ezinvmvc.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Sales.DTO
{
   public class GetRFQListInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public bool ForExport { get; set; } = false;

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "";
            }
            if (string.IsNullOrEmpty(Filter))
            {
                Filter = "";
            }

            if(ForExport == null)
            {
                ForExport = false;
            }
        }
    }
}
