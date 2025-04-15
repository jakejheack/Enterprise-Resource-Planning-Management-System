using Abp.Application.Services.Dto;
using ezinvmvc.App.Sales.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.DTO
{
    public class UpdateRFQInput
    {
        public RFQInput rfq { get; set; }
        public List<RFQDetailsInput> rfqdetails { get; set; }
        public List<RFQOtherDetailsInput> rfqotherdetails { get; set; }
    }
}
