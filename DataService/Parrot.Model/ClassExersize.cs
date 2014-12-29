using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class ClassExersize
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public bool IsPractise { get; set; }
        [ForeignKey("Class")]
        public int ClassId { get; set; }
        [ForeignKey("Exersize")]
        public int ExersizeId { get; set; }
        public virtual Class Class { get; set; }
        public virtual Exersize Exersize { get; set; }

    }
}
