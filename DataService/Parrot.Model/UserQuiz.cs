using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class UserQuiz
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        //[ForeignKey("User")]
        public int UserId { get; set; }

        //public virtual User User { get; set; }

        //[ForeignKey("Quiz")]
        public int QuizId { get; set; }

        //public virtual Quiz Quiz { get; set; }

        public string Answer { get; set;}

        public int Score { get; set; }

        public int SecondsSpend { get; set; }
    }
}
