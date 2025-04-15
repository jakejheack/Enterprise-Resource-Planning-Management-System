using System;
using System.Collections.Generic;
using ezinvmvc.App.EmployeesAccountsAbility.Dto;
using System.Threading.Tasks;
using ezinvmvc.App.Employees.Dto;

namespace ezinvmvc.Web.Models.EmployeesAccountsAbility
{
    public class AccountAbilityViewModel
    {
        public string FilterText { get; set; }
        public List<GetEmployeeOutput> Employees { get; set; }
    }
}
