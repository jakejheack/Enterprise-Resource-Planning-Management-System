using Abp.Application.Services.Dto;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Employees.Dto
{
    public class GetEmployeeDetailsOutput : FullAuditedEntityDto<int>
    {
        public int? EmployeeId { get; set; }

        public string EmployeeCode { get; set; }
        //Emergency
        public string Name { get; set; }

        public string Relation { get; set; }

        public string ContactNum { get; set; }

        public string Address { get; set; }

        //Fathers
        public string FathersName { get; set; }

        public string FathersAddress { get; set; }

        public string FathersContactNum { get; set; }

        //Mothers
        public string MothersName { get; set; }

        public string MothersAddress { get; set; }

        public string MothersContactNum { get; set; }

        //Spouse
        public string SpouseName { get; set; }

        public string SpouseAddress { get; set; }

        public string SpouseContactNum { get; set; }

        //Dependents
        public string D1Name { get; set; }

        public string D1Address { get; set; }

        public string D1Status { get; set; }

        public string D2Name { get; set; }

        public string D2Address { get; set; }

        public string D2Status { get; set; }

        public string D3Name { get; set; }

        public string D3Address { get; set; }

        public string D3Status { get; set; }

        public string D4Name { get; set; }

        public string D4Address { get; set; }

        public string D4Status { get; set; }

        //Attaintment

        public string Primary { get; set; }

        public DateTime? PrimaryDateGrad { get; set; }

        public string Secondary { get; set; }

        public DateTime? SecondaryDateGrad { get; set; }

        public string Course { get; set; }

        public DateTime? CourseDateGrad { get; set; }

        [NotMapped]
        public int OldId { get; set; }
    }
}
