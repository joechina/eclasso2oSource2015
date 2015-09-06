namespace Parrot.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class delta : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Announcements",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Content = c.String(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        Target = c.String(),
                        Priority = c.Boolean(nullable: false),
                        Title = c.String(),
                        Draft = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserAnnouncements",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        AnnouncementId = c.Int(nullable: false),
                        HighPriority = c.Boolean(nullable: false),
                        NotifyTs = c.DateTime(),
                        ReadTs = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Announcements", t => t.AnnouncementId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.AnnouncementId);
            
            CreateTable(
                "dbo.Classes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        ClassNumber = c.String(nullable: false),
                        Description = c.String(),
                        AccessCode = c.String(),
                        Start = c.DateTime(nullable: false),
                        End = c.DateTime(nullable: false),
                        TeacherId = c.Int(nullable: false),
                        autoApproved = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserClasses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        ClassId = c.Int(nullable: false),
                        Approved = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.Classes", t => t.ClassId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.ClassId);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserGuid = c.String(nullable: false),
                        UserId = c.String(nullable: false),
                        Name = c.String(nullable: false),
                        Role = c.String(nullable: false),
                        Email = c.String(),
                        Phone = c.String(),
                        lastSignin = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserExersizes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Assigned = c.DateTime(),
                        Deadline = c.DateTime(),
                        Progress = c.String(),
                        Result = c.String(),
                        IsOwner = c.Boolean(nullable: false),
                        UserId = c.Int(),
                        Completed = c.Boolean(nullable: false),
                        ExersizeId = c.Int(nullable: false),
                        ClassId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Exersizes", t => t.ExersizeId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.ExersizeId);
            
            CreateTable(
                "dbo.Exersizes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        IsExam = c.Boolean(nullable: false),
                        TotalQuizzes = c.Int(nullable: false),
                        Visible = c.Boolean(nullable: false),
                        Category = c.Int(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ExersizeSections",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        ExersizeId = c.Int(nullable: false),
                        Seq = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Exersizes", t => t.ExersizeId, cascadeDelete: true)
                .Index(t => t.ExersizeId);
            
            CreateTable(
                "dbo.Problems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GeneralInfo = c.String(),
                        MediaId = c.Int(),
                        ExersizeSectionId = c.Int(nullable: false),
                        Seq = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ExersizeSections", t => t.ExersizeSectionId, cascadeDelete: true)
                .Index(t => t.ExersizeSectionId);
            
            CreateTable(
                "dbo.Quizs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ProblemId = c.Int(nullable: false),
                        Seq = c.Int(nullable: false),
                        QuizType = c.Int(nullable: false),
                        QuizDetail = c.String(),
                        Challenge = c.String(),
                        Score = c.Int(nullable: false),
                        Key = c.String(),
                        Answer = c.String(),
                        Comment = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Problems", t => t.ProblemId, cascadeDelete: true)
                .Index(t => t.ProblemId);
            
            CreateTable(
                "dbo.UserQuizs",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        QuizId = c.Int(nullable: false),
                        Answer = c.String(),
                        Score = c.Int(nullable: false),
                        SecondsSpend = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Quizs", t => t.QuizId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.QuizId);
            
            CreateTable(
                "dbo.Questions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        QuestionDetail = c.String(),
                        Answer = c.String(),
                        Create = c.DateTime(nullable: false),
                        IsPublic = c.Boolean(nullable: false),
                        UserId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Feedbacks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        Comment = c.String(),
                        CreateDate = c.DateTime(nullable: false),
                        Title = c.String(),
                        Category = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Media",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Type = c.String(nullable: false),
                        isCompressed = c.Boolean(nullable: false),
                        Content = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserClasses", "ClassId", "dbo.Classes");
            DropForeignKey("dbo.UserQuizs", "UserId", "dbo.Users");
            DropForeignKey("dbo.Questions", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserExersizes", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserExersizes", "ExersizeId", "dbo.Exersizes");
            DropForeignKey("dbo.UserQuizs", "QuizId", "dbo.Quizs");
            DropForeignKey("dbo.Quizs", "ProblemId", "dbo.Problems");
            DropForeignKey("dbo.Problems", "ExersizeSectionId", "dbo.ExersizeSections");
            DropForeignKey("dbo.ExersizeSections", "ExersizeId", "dbo.Exersizes");
            DropForeignKey("dbo.UserClasses", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserAnnouncements", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserAnnouncements", "AnnouncementId", "dbo.Announcements");
            DropIndex("dbo.Questions", new[] { "UserId" });
            DropIndex("dbo.UserQuizs", new[] { "QuizId" });
            DropIndex("dbo.UserQuizs", new[] { "UserId" });
            DropIndex("dbo.Quizs", new[] { "ProblemId" });
            DropIndex("dbo.Problems", new[] { "ExersizeSectionId" });
            DropIndex("dbo.ExersizeSections", new[] { "ExersizeId" });
            DropIndex("dbo.UserExersizes", new[] { "ExersizeId" });
            DropIndex("dbo.UserExersizes", new[] { "UserId" });
            DropIndex("dbo.UserClasses", new[] { "ClassId" });
            DropIndex("dbo.UserClasses", new[] { "UserId" });
            DropIndex("dbo.UserAnnouncements", new[] { "AnnouncementId" });
            DropIndex("dbo.UserAnnouncements", new[] { "UserId" });
            DropTable("dbo.Media");
            DropTable("dbo.Feedbacks");
            DropTable("dbo.Questions");
            DropTable("dbo.UserQuizs");
            DropTable("dbo.Quizs");
            DropTable("dbo.Problems");
            DropTable("dbo.ExersizeSections");
            DropTable("dbo.Exersizes");
            DropTable("dbo.UserExersizes");
            DropTable("dbo.Users");
            DropTable("dbo.UserClasses");
            DropTable("dbo.Classes");
            DropTable("dbo.UserAnnouncements");
            DropTable("dbo.Announcements");
        }
    }
}
