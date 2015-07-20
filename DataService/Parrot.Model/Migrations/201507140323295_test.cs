namespace Parrot.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class test : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Media", "audioText", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Media", "audioText");
        }
    }
}
