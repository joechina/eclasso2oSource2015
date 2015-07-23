using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class Media{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Type { get; set; }
        public bool isCompressed { get; set; }
        public string Content { get; set; } //Base64 encoded data
        //public int ProblemId { get; set; }
        //public virtual Problem Problem { get; set; }
    }
}
