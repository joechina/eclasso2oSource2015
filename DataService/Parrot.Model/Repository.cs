using Breeze.ContextProvider.EF6;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class Repository : EFContextProvider<DataContext>, IDisposable
    {
        //public Repository(string userGuid)
        //{
        //    UserGuid = userGuid;
        //}

        //public string UserGuid { get; private set; }

        public DbQuery<User> Users
        {
            get
            {
                return Context.Users;
                //return Context.Users.Include("Exersizes").Include("Exersizes.Exersize");
            }
        }

        public DbQuery<Class> Classes
        {
            get
            {
                return Context.Classes.Include("Users").Include("Teacher");
            }
        }

        public int SaveAll()
        {
            return Context.SaveChanges();
        }

        public UserAnnouncement NewUserAnnouncement
        {
            get
            {
                var result = Context.UserAnnouncements.Create();
                Context.UserAnnouncements.Add(result);
                return result;
            }
        }
        public DbQuery<Announcement> Announcements
        {
            get
            {
                return Context.Announcements.Include("Users");
            }
        }
        public DbQuery<UserAnnouncement> UserAnnouncements
        {
            get
            {
                return Context.UserAnnouncements;
            }
        }
        public DbQuery<UserExersize> UserExersizes
        { 
            get
            {
                return Context.UserExersizes.Include("Exersize");
            }
        }

        public DbQuery<ClassExersize> ClassExersizes
        {
            get
            {
                return Context.ClassExersizes;
            }
        }

        public DbQuery<Exersize> Exersizes
        {
            get
            {
                return Context.Exersizes.Include("Sections").Include("Sections.Problems").Include("Sections.Problems.Quizzes");
            }
        }

        public DbQuery<ExersizeSection> ExersizeSections
        {
            get
            {
                return Context.ExersizeSections.Include("Problems");
            }
        }

        public DbQuery<Problem> Problems
        {
            get
            {
                return Context.Problems.Include("Quizzes");
            }
        }

        public DbQuery<Media> Media
        {
            get
            {
                return Context.Media;
            }
        }

        public DbQuery<Question> Questions
        {
            get
            {
                return Context.Questions;
            }
        }

        public DbQuery<Quiz> Quizzes
        {
            get
            {
                return Context.Quizzes;
            }
        }

        public DbQuery<UserQuiz> UserQuizs
        {
            get
            {
                return Context.UserQuizs;
            }
        }
        public DbQuery<UserClass> UserClasses
        {
            get
            {
                return Context.UserClasses.Include("Class");
            }
        }

        public DbQuery<Feedback> Feedbacks
        {
            get
            {
                return Context.Feedbacks;
            }
        }
        public void Dispose()
        {
            Context.Dispose();
        }
    }
}
