using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.GroupTypes
{
    [Table("AppGroupType")]
    public class GroupType : FullAuditedEntity<int>
    {
        [Required]
        public string GroupTypes { get; set; }

        [Required]
        public string Group { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Ids { get; set; }

        public string Status { get; set; }
    }
}
