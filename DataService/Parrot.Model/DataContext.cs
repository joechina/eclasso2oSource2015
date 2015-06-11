using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class DataContext : DbContext
    {
        public DataContext()
            : base("name=DefaultConnection")
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Exersize> Exersizes { get; set; }
        public DbSet<ExersizeSection> ExersizeSections { get; set; }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Media> Media { get; set; }
        public DbSet<UserAnnouncement> UserAnnouncements { get; set; }
        public DbSet<UserExersize> UserExersizes { get; set; }
        public DbSet<UserQuiz> UserQuizs { get; set; }
        public DbSet<UserClass> UserClasses { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
    }
}
