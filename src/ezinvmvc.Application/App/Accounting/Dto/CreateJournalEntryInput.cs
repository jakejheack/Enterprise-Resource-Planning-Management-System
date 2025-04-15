using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Sales.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Accounting.Dto
{
   public class CreateJournalEntryInput : FullAuditedEntity<int>
    {
        public JournalEntryInput JournalEntry { get; set; }
        public List<JournalEntryItemInput> JournalEntryItems { get; set; }
        
    }
}
