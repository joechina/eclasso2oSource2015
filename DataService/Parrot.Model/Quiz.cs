using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class Quiz
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ProblemId { get; set; }
        public int seq { get; set; }

        public int QuizType { get; set; }

        public string QuizDetail { get; set; }
        public string Challenge { get; set; }
        public int Score { get; set; }
        public string Key { get; set; }
        public string Answer { get; set; }
        public string Comment { get; set; }
        public virtual Problem Problem { get; set; }
        public virtual List<UserQuiz> User { get; set; }
    }
}
