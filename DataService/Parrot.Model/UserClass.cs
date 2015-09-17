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

        // Status: 0:"未批准"; 1: "已加入"; 2:"等待批准";
        public int Status { get; set; }
        //public virtual User User { get; set; }
        //public virtual Class Class { get; set; }
    }
}
