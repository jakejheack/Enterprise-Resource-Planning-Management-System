using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Common.Dto
{
    public class GetDocumentOutput : FullAuditedEntity<int>
    {
        public string Reference { get; set; }

        public int ReferenceId { get; set; }

        public string Description { get; set; }

        public string FileName { get; set; }

        public string FileExtension { get; set; }

        public string FilePath { get; set; }

        [NotMapped]
        public string FullName { get; set; }

        [NotMapped]
        public string ReferenceCode { get; set; }

        [NotMapped]
        public string ReferenceName { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
