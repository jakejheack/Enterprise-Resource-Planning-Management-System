using Abp.Runtime.Validation;
using ezinvmvc.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.CheckVoucher.Dto
{
   public class GetCVListInput : PagedAndSortedInputDto, IShouldNormalize
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
        }
    }
}
