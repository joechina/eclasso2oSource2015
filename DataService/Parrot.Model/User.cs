using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class User
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id {get; set;}
        [Required]
        public string UserGuid { get; set; } //internal id to link to aspnet database
        [Required]
        public string UserId { get; set; } //email or phonenumber
        [Required]
        public string Name { get; set; }
        [Required]
        public string Role { get; set; } //T or S (Teacher/Student)

        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime lastSignin { get; set; }
        
        public virtual List<UserClass> Classes { get; set; }
        public virtual List<UserExersize> Exersizes { get; set; }
        public virtual List<UserQuiz> Quizzes { get; set; } //To store quiz answer
        public virtual List<UserAnnouncement> Announcements { get; set; }
        public virtual List<Question> Questions { get; set; } //Private questions to Teacher

    }
}
