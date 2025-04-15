using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Common.Models
{
    [Table("AppJournalEntryStatusTypes")]
    public class JournalEntryStatusTypes : Entity<int>
    {
        public int StatusId { get; set; }

        public string Status { get; set; }


    }
}