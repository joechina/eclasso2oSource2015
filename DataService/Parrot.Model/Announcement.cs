using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class Announcement
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Content { get; set; }
        public DateTime CreateDate { get; set; }
        public string Target { get; set; } //G_A list of user ids(comma deliminated), All, C_ClassId
        public int Priority { get; set; }
        public string Title { get; set; }

        public virtual List<UserAnnouncement> Users { get; set; }
    }
}
