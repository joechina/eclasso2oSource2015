using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    [Serializable]
    public class UserAnnouncement
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int AnnouncementId { get; set; }

        public bool HighPriority { get; set; } // might change to int in the future

        public DateTime? NotifyTs { get; set; }
        
        public DateTime? ReadTs { get; set; }

        //public virtual User User { get; set; }
        //public virtual Announcement Announcement { get; set; }


    }
}
