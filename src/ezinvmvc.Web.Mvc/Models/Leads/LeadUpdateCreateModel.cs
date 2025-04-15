using ezinvmvc.App.Clients.Dto;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Leads.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.Leads
{
    public class LeadUpdateCreateModel
    {
        public CreateLeadUpdateInput LeadUpdate { get; set; }
        public GetLeadOutput Lead { get; set; }
        public List<GetLeadTaskOutput> Tasks { get; set; }
        //public List<GetEmployeeOutput> Users { get; set; }
    }
}
