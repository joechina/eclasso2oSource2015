namespace Parrot.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class test2 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Media", "audioText");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Media", "audioText", c => c.String());
        }
    }
}
