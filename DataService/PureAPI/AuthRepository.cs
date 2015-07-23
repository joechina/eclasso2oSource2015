using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PureAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Parrot.Model;

namespace PureAPI
{
    public class AuthRepository : IDisposable
    {
        private AuthContext _ctx;

        private UserManager<IdentityUser> _userManager;

        public AuthRepository()
        {
            _ctx = new AuthContext();
            _userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
        }

        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            IdentityUser user = new IdentityUser
            {
                UserName = userModel.UserName
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

            var myctx = new DataContext();
            var u = myctx.Users.Create();
            u.Name = userModel.Name;
            u.Role = userModel.Role;
            u.Email = userModel.Email;
            u.Phone = userModel.Phone;
            u.UserGuid = user.Id;
            u.UserId = userModel.UserName;
            u.lastSignin = DateTime.Now;
            myctx.Users.Add(u);
            try {
                myctx.SaveChanges();
            }
            catch (Exception ex)
            {
                string message = ex.Message;
            }

            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await _userManager.FindAsync(userName, password);

            return user;
        }

        public async Task<IdentityResult> ChangePassword(string userId, string oldpassword, string newpassword)
        {
            IdentityResult result = await _userManager.ChangePasswordAsync(userId, oldpassword, newpassword);
            return result;
        }

        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }
    }
}