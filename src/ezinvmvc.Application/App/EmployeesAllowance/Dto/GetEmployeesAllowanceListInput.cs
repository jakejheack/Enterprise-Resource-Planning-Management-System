using Abp.Runtime.Validation;
using ezinvmvc.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.EmployeesAllowance.Dto
{
    public class GetEmployeesAllowanceListInput : PagedAndSortedInputDto, IShouldNormalize
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
