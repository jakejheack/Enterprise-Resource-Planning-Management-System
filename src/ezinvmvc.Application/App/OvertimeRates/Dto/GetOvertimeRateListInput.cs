using Abp.Runtime.Validation;
using ezinvmvc.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.OvertimeRates.Dto
{
    public class GetOvertimeRateListInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public void Normalize()
        {
            //if (string.IsNullOrEmpty(Sorting))
            //{
            //    Sorting = "";
            //}
            if (string.IsNullOrEmpty(Filter))
            {
                Filter = "";
            }
        }
    }
}
