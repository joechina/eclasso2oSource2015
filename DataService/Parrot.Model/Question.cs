using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class Question
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string QuestionDetail { get; set; }
        public string Answer { get; set; }
        public DateTime Create { get; set; }
        public bool IsPublic { get; set; }
        public int? UserId { get; set; }
        public virtual User Student { get; set; }
        
    }
}
