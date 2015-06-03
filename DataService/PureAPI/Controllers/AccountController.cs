using Microsoft.AspNet.Identity;
using Newtonsoft.Json.Linq;
using Parrot.Model;
using PureAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace PureAPI.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        public class Ok
        {
            public string Result;
        }
        private Repository _repository;
        private string userGuid;
        private AuthRepository _repo = null;

        public AccountController()
        {
            _repo = new AuthRepository();
            try
            {
                userGuid = ((System.Security.Claims.ClaimsIdentity)User.Identity).FindFirst("Id").Value;
            
            }
            catch
            {
                //do nothing
            }
        }

        
        [AllowAnonymous]
        [Route("Test")]
        [HttpGet]
        public List<UserExersize> Test()
        {
            var repo = new Repository();
            try
            {
                return repo.UserExersizes.ToList();
            }
            catch (Exception ex)
            {
                UserExersize u = new UserExersize();
                u.Progress = ex.Message;
                List<UserExersize> result = new List<UserExersize>();
                result.Add(u);
                return result;
            }
            finally
            {
                repo.Dispose();
            }
            
        }

        [AllowAnonymous]
        [Route("LoadQuestion")]
        [HttpGet]
        public Ok LoadQuestion()
        {
            DataContext repo = new DataContext();
            Ok result;
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["source"].ConnectionString))
            {
                con.Open();
                var command = con.CreateCommand();
                command.CommandText = "Select [QuestionDetail],[Answer],[Create] from dbo.Questions";
                var rdr = command.ExecuteReader();
                while (rdr.Read())
                {
                    var q = new Question();
                    q.Answer = rdr.GetString(1);
                    q.QuestionDetail = rdr.GetString(0);
                    q.Create = rdr.GetDateTime(2);
                    q.IsPublic = true;
                    q.UserId = 1;
                    repo.Questions.Add(q);
                }
                try
                {
                    repo.SaveChanges();
                    result= new Ok() { Result = "Done"};
                    
                }
                catch (Exception ex)
                {
                    result = new Ok() { Result = ex.Message};
                }
                return result;
            }

        }

        [AllowAnonymous]
        [Route("LoadMessage")]
        [HttpGet]
        public Ok LoadMessage()
        {
            DataContext repo = new DataContext();
            Ok result;
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["source"].ConnectionString))
            {
                con.Open();
                var command = con.CreateCommand();
                command.CommandText = "Select [Content],[CreateDate],[Target],[Title] from dbo.Announcements";
                var rdr = command.ExecuteReader();
                while (rdr.Read())
                {
                    var msg = new Announcement();
                    msg.Content = rdr.GetString(0);
                    msg.CreateDate = rdr.GetDateTime(1);
                    msg.Target = rdr.GetString(2);
                    msg.Title = rdr.GetString(3);
                    msg.Priority = 0;

                    repo.Announcements.Add(msg);
                }
                try
                {
                    repo.SaveChanges();
                    result = new Ok() { Result = "Done" };

                }
                catch (Exception ex)
                {
                    result = new Ok() { Result = ex.Message };
                }
                return result;
            }

        }

        [AllowAnonymous]
        [Route("LoadQuizs")]
        [HttpGet]
        public Ok LoadQuizs()
        {
            DataContext repo = new DataContext();
            Ok result;
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["source"].ConnectionString))
            {
                con.Open();
                var command = con.CreateCommand();
                command.CommandText = "Select [ProblemId],[seq],[QuizType],[QuizDetail],[Challenge],[Score],[Key],[Answer] from dbo.Quizs";
                var rdr = command.ExecuteReader();
                while (rdr.Read())
                {
                    var quiz = new Quiz();
                    int pId = rdr.GetInt32(0);
                    switch (pId) {
                        case 1:
                            quiz.ProblemId = 1;
                            break;
                        case 1003:
                            quiz.ProblemId = 2;
                            break;
                        case 1004:
                            quiz.ProblemId = 3;
                            break;
                        case 1005:
                            quiz.ProblemId = 4;
                            break;
                    }
                    
                    quiz.seq = rdr.GetInt32(1);
                    quiz.QuizType = rdr.GetInt32(2);
                    if (!rdr.IsDBNull(rdr.GetOrdinal("QuizDetail")))
                        quiz.QuizDetail = rdr.GetString(3);
                    quiz.Challenge = rdr.GetString(4);
                    quiz.Score = rdr.GetInt32(5);
                    if (!rdr.IsDBNull(rdr.GetOrdinal("Key")))
                        quiz.Key = rdr.GetString(6);
                    if (!rdr.IsDBNull(rdr.GetOrdinal("Answer")))
                        quiz.Answer = rdr.GetString(7);

                    repo.Quizzes.Add(quiz);
                }
                try
                {
                    repo.SaveChanges();
                    result = new Ok() { Result = "LoadQuiz Done" };

                }
                catch (Exception ex)
                {
                    result = new Ok() { Result = ex.Message };
                }
                return result;
            }

        }

        [AllowAnonymous]
        [Route("LoadExersizes")]
        [HttpGet]
        public Ok LoadExersizes()
        {
            DataContext repo = new DataContext();
            Ok result;
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["source"].ConnectionString))
            {
                con.Open();
                var command = con.CreateCommand();
                command.CommandText = "Select [Name],[Description],[IsExam] from dbo.Exersizes";
                var rdr = command.ExecuteReader();
                while (rdr.Read())
                {
                    var ex = new Exersize();
                    ex.Name = rdr.GetString(0);
                    if (!rdr.IsDBNull(rdr.GetOrdinal("Description")))
                        ex.Description = rdr.GetString(1);
                    ex.IsExam = rdr.GetBoolean(2);

                    repo.Exersizes.Add(ex);
                }
                try
                {
                    repo.SaveChanges();
                    result = new Ok() { Result = "LoadExersizes Done" };

                }
                catch (Exception ex)
                {
                    result = new Ok() { Result = ex.Message };
                }
                return result;
            }

        }

        [AllowAnonymous]
        [Route("LoadExersizeSections")]
        [HttpGet]
        public Ok LoadExersizeSections()
        {
            DataContext repo = new DataContext();
            Ok result;
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["source"].ConnectionString))
            {
                con.Open();
                var command = con.CreateCommand();
                command.CommandText = "Select [Name],[ExersizeId] from dbo.ExersizeSections";
                var rdr = command.ExecuteReader();
                while (rdr.Read())
                {
                    var ex = new ExersizeSection();
                    if (!rdr.IsDBNull(rdr.GetOrdinal("Name")))
                        ex.Name = rdr.GetString(0);

                    int exId = rdr.GetInt32(1);
                    switch (exId) {
                        case 1:
                            ex.ExersizeId = 5;
                            break;
                        case 1003:
                            ex.ExersizeId = 6;
                            break;
                        case 1004:
                            ex.ExersizeId = 7;
                            break;
                        case 1005:
                            ex.ExersizeId = 8;
                            break;

                    }
                    

                    repo.ExersizeSections.Add(ex);
                }
                try
                {
                    repo.SaveChanges();
                    result = new Ok() { Result = "LoadExersizeSections Done" };

                }
                catch (Exception ex)
                {
                    result = new Ok() { Result = ex.Message };
                }
                return result;
            }

        }

        [AllowAnonymous]
        [Route("LoadMedia")]
        [HttpGet]
        public Ok LoadMedia()
        {
            DataContext repo = new DataContext();
            Ok result;
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["source"].ConnectionString))
            {
                con.Open();
                var command = con.CreateCommand();
                command.CommandText = "Select [Type],[isCompressed],[Content] from dbo.Media";
                var rdr = command.ExecuteReader();
                while (rdr.Read())
                {
                    var m = new Media();
                    m.Type = rdr.GetString(0);
                    m.isCompressed = rdr.GetBoolean(1);
                    m.Content = rdr.GetString(2);

                    repo.Media.Add(m);
                }
                try
                {
                    repo.SaveChanges();
                    result = new Ok() { Result = "LoadMedia Done" };

                }
                catch (Exception ex)
                {
                    result = new Ok() { Result = ex.Message };
                }
                return result;
            }

        }

        [AllowAnonymous]
        [Route("LoadProblems")]
        [HttpGet]
        public Ok LoadProblems()
        {
            DataContext repo = new DataContext();
            Ok result;
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["source"].ConnectionString))
            {
                con.Open();
                var command = con.CreateCommand();
                command.CommandText = "Select [GeneralInfo],[MediaId],[ExersizeSectionId] from dbo.Problems";
                var rdr = command.ExecuteReader();
                while (rdr.Read())
                {
                    var m = new Problem();
                    m.GeneralInfo = rdr.GetString(0);

                    if (!rdr.IsDBNull(rdr.GetOrdinal("MediaId")))
                    {
                        int mId = rdr.GetInt32(1);
                        switch (mId)
                        {
                            case 1:
                                m.MediaId = 4;
                                break;
                            case 4:
                                m.MediaId = 5;
                                break;
                            case 5:
                                m.MediaId = 6;
                                break;
                        }
                    }

                    int secId = rdr.GetInt32(2);
                    switch (secId)
                    {
                        case 1:
                            m.ExersizeSectionId = 3;
                            break;
                        case 1003:
                            m.ExersizeSectionId = 4;
                            break;
                        case 1004:
                            m.ExersizeSectionId = 5;
                            break;
                        case 1005:
                            m.ExersizeSectionId = 6;
                            break;
                    }
                    

                    repo.Problems.Add(m);
                }
                try
                {
                    repo.SaveChanges();
                    result = new Ok() { Result = "LoadProblems Done" };

                }
                catch (Exception ex)
                {
                    result = new Ok() { Result = ex.Message };
                }
                return result;
            }

        }


        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await _repo.RegisterUser(userModel);

            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            Ok RegisterResult = new Ok() { Result = "Success"};
            return Ok(RegisterResult);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repo.Dispose();
            }

            base.Dispose(disposing);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
        /*
        [HttpPost]

        public JToken PublishAnouncement(int Id, string Target)
        {
            var repo = new Repository();
            try
            {
                var announcement = repo.Announcements.FirstOrDefault(a => a.Id == Id);
                announcement.Target = Target;
                var targetType = Target.Substring(0, 1);
                List<User> users;
                users = repo.Users.ToList();
                Class cls;
                if (targetType == "C")
                {
                    cls = repo.Classes.FirstOrDefault(c=>c.ClassNumber == Target.Substring(2));
                    users = cls.Users.Select(u=>u.User).ToList();
                    
                }
                foreach(var u in users)
                {
                    UserAnnouncement ua = repo.NewUserAnnouncement;
                    ua.AnnouncementId = Id;
                    ua.UserId = u.Id;
                    if (announcement.Users == null)
                    {
                        announcement.Users = new List<UserAnnouncement>();
                    }
                    announcement.Users.Add(ua);
                }
                int changeCount = repo.SaveAll();
                return JObject.Parse("{ count : " + changeCount.ToString() + "}");
            }
            finally
            {
                repo.Dispose();
            }
        }
         * */
    }
}
