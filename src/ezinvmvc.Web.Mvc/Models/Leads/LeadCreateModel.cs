using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Clients.Dto;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Leads.Dto;
using System.Collections.Generic;

namespace ezinvmvc.Web.Models.Leads
{
    public class LeadCreateModel
    {
        public CreateLeadInput Lead { get; set; }
        public List<GetLeadSourceOutput> Sources { get; set; }
        public List<GetLeadTaskOutput> Tasks { get; set; }
        //public List<GetIndustryOutput> Industries { get; set; }
        //public List<GetCountryOutput> Countries { get; set; }
        //public List<GetProvinceOutput> Provinces { get; set; }
        //public List<GetCityOutput> Cities { get; set; }
        public List<GetEmployeeOutput> Users { get; set; }
        public int EmpId { get; set; }
    }
}
