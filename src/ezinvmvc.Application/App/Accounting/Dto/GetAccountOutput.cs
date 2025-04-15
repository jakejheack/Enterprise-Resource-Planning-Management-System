using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Accounting.Dto
{
    public class GetAccountOutput : FullAuditedEntityDto<int>
    {
        public int Node { get; set; }

        public int ParentNode { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        public int AccountClassId { get; set; }

        public int AccountTypeId { get; set; }

        public int AccountGroupId { get; set; }

        public int CompanyId { get; set; }

        public int IsChild { get; set; }

        public int IsActive { get; set; }
        //Not Mapped

        [NotMapped]
        public string AccountClass { get; set; }

        [NotMapped]
        public string AccountBase { get; set; }

        [NotMapped]
        public string AccountType { get; set; }

        [NotMapped]
        public string AccountGroup { get; set; }

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string CompanyAbbr { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public int tt_key { get; set; }

        [NotMapped]
        public int tt_parent { get; set; }
    }
}
