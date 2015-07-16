namespace Parrot.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Comment : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Quizs", "Comment", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Quizs", "Comment");
        }
    }
}
