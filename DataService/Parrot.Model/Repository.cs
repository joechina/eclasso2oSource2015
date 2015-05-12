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
                return (DbQuery<User>)Context.Users;
            }
        }

        public DbQuery<Class> Classes
        {
            get
            {
                return (DbQuery<Class>)Context.Classes.Include("Users");
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
                return (DbQuery<Announcement>)Context.Announcements.Include("Users");
            }
        }
        public DbQuery<UserExersize> UserExersizes
        { 
            get
            {
                return (DbQuery<UserExersize>)Context.UserExersizes;
            }
        }

        public DbQuery<Exersize> Exersizes
        {
            get
            {
                return (DbQuery<Exersize>)Context.Exersizes.Include("Sections").Include("Sections.Problems");
            }
        }

        public DbQuery<ExersizeSection> ExersizeSections
        {
            get
            {
                return (DbQuery<ExersizeSection>)Context.ExersizeSections.Include("Problems");
            }
        }

        public DbQuery<Problem> Problems
        {
            get
            {
                return (DbQuery<Problem>)Context.Problems.Include("Quizzes");
            }
        }

        public DbQuery<Media> Media
        {
            get
            {
                return (DbQuery<Media>)Context.Media;
            }
        }

        public DbQuery<Question> Questions
        {
            get
            {
                return (DbQuery<Question>)Context.Questions;
            }
        }

        public void Dispose()
        {
            Context.Dispose();
        }
    }
}
