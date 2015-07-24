using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class Problem
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string GeneralInfo { get; set; }
        public int? MediaId { get; set; }
        
        public int ExersizeSectionId { get; set; }
        public int Seq { get; set; }

        public virtual List<Quiz> Quizzes { get; set; }
        public virtual ExersizeSection ExersizeSection { get; set; }
        //public virtual Media Media { get; set; }

    }
}
