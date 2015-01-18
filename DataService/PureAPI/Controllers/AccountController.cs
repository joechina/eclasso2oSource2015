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
        public List<User> Test()
        {
            var repo = new Repository();
            try
            {
                return repo.Users.ToList();
            }
            catch (Exception ex)
            {
                User u = new User();
                u.UserGuid = ex.Message;
                List<User> result = new List<User>();
                result.Add(u);
                return result;
            }
            finally
            {
                repo.Dispose();
            }
            
        }

        [AllowAnonymous]
        [Route("LoadData")]
        [HttpGet]
        public Ok LoadData()
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
    }
}
