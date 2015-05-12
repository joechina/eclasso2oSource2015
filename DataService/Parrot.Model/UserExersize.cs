using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class UserExersize
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime Assigned { get; set; }
        public DateTime Deadline { get; set; }
        public string Progress { get; set; }
        public string Result { get; set; } //Structure including - user answers and scores
        public bool IsOwner { get; set; }
        public int UserId { get; set; }
        public int ExersizeId { get; set; }
        //public virtual User User { get; set; }
        public virtual Exersize Exersize { get; set; }
    }
}
