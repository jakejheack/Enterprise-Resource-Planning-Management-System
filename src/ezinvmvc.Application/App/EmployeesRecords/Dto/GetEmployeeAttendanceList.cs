using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.EmployeesRecords.Dto
{
    public class GetEmployeeAttendanceList
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
