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
                return (DbQuery<User>)Context.Users.Include("Exersizes").Include("Classes").Include("Announcements");
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
                return (DbQuery<Announcement>)Context.Announcements;
            }
        }

        public DbQuery<Exersize> Exersizes
        {
            get
            {
                return (DbQuery<Exersize>)Context.Exersizes.Include("Sections").Include("Sections.Problems").Include("Sections.Problems.Quizzes").Include("Sections.Problems.Media");
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
