using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Accounting.Dto
{
   public class GetJournalEntryOutput
    {
        public int CompanyId { get; set; }

        public int SeriesTypeId { get; set; }

        public string Prefix { get; set; }

        public string Code { get; set; }

        public DateTime TransactionTime { get; set; }

        public int JournalTypeId { get; set; }

        public int ProjectId { get; set; }

        public int StatusId { get; set; }

        public string Notes { get; set; }

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string JournalType { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public int Totaldebit { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
