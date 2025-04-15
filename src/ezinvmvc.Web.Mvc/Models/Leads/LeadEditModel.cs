using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Leads.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.Leads
{
    public class LeadEditModel
    {
        public UpdateLeadInput Lead { get; set; }
        public List<GetLeadSourceOutput> Sources { get; set; }
        public List<GetLeadTaskOutput> Tasks { get; set; }
        public List<GetEmployeeOutput> Users { get; set; }
        public int EmpId { get; set; }
    }
}
