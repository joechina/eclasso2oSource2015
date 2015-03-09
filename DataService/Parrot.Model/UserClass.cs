using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class UserClass
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ClassId { get; set; }
        public bool Approved { get; set; }
        public virtual User User { get; set; }
        //public virtual Class Class { get; set; }
    }
}
