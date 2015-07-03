using Breeze.WebApi2;
using Parrot.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Breeze.ContextProvider;
using Newtonsoft.Json.Linq;


namespace Parrot.Controllers
{
    [BreezeController]
    [Authorize]
    public class eClassO2OApiController : ApiController
    {
        private Repository _repository;
        private string userGuid;

        public eClassO2OApiController()
        {
            try
            {
                userGuid = ((System.Security.Claims.ClaimsIdentity)User.Identity).FindFirst("Id").Value;
            }
            catch
            {

            }
        }

        // GET ~/api/TripPlan/Metadata 
        [HttpGet]
        [AllowAnonymous]
        public string Metadata()
        {
            _repository = new Repository();
            return _repository.Metadata();
        }

        [HttpGet]
        public IQueryable<User> Users()
        {
            _repository = new Repository();
            return _repository.Users;

        }

        [HttpGet]
        public User currentUser()
        {
            _repository = new Repository();
            return _repository.Users.Single(u=>u.UserGuid == userGuid);
        }

        [HttpGet]
        public IQueryable<Class> Classes()
        {
            _repository = new Repository();
            return _repository.Classes;

        }

        [HttpGet]
        public IQueryable<Announcement> Announcements()
        {
            _repository = new Repository();
            return _repository.Announcements;

        }

        [HttpGet]
        public IQueryable<UserExersize> UserExersizes()
        {
            _repository = new Repository();
            return _repository.UserExersizes;

        }

        [HttpGet]
        public IQueryable<Exersize> Exersizes()
        {
            _repository = new Repository();
            return _repository.Exersizes;

        }

        [HttpGet]
        public IQueryable<ExersizeSection> ExersizeSections()
        {
            _repository = new Repository();
            return _repository.ExersizeSections;

        }

        [HttpGet]
        public IQueryable<Media> Media()
        {
            _repository = new Repository();
            return _repository.Media;

        }

        [HttpGet]
        public IQueryable<Question> Questions()
        {
            _repository = new Repository();
            return _repository.Questions;

        }

        [HttpGet]
        public IQueryable<Problem> Problems()
        {
            _repository = new Repository();
            return _repository.Problems;

        }

        [HttpGet]
        public IQueryable<UserQuiz> UserQuizs(int userId, int excersizeId)
        {
            _repository = new Repository();
            var result = (from e in _repository.UserQuizs
                          join q in _repository.Quizzes on e.QuizId equals q.Id
                          where e.UserId == userId && q.Problem.ExersizeSection.Exersize.Id == excersizeId
                          select e).ToList();
            return result.AsQueryable();

        }

        [HttpGet]
        public IQueryable<UserQuiz> UserQuizs()
        {
            _repository = new Repository();
            return _repository.UserQuizs;

        }

        [HttpGet]
        public IQueryable<UserClass> UserClasses()
        {
            _repository = new Repository();
            return _repository.UserClasses;

        }
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            _repository = new Repository();
            return _repository.SaveChanges(saveBundle);
        }

        
    }
}
