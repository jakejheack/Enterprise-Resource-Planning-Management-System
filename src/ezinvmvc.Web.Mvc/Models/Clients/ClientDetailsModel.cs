using ezinvmvc.App.Clients.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.Clients
{
    public class ClientDetailsModel
    {
        public GetClientOutput Client { get; set; }
        public int EmpId { get; set; }
    }
}
