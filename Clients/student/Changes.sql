/*
   Wednesday, July 22, 20152:31:25 PM
   User: 
   Server: localhost\SQLEXPRESS
   Database: eclasso2o
   Application: 
*/

/* To prevent any potential data loss issues, you should review this script in detail before running it outside the context of the database designer.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Problems ADD
	Seq int NOT NULL CONSTRAINT DF_Problems_Seq DEFAULT 0
GO
ALTER TABLE dbo.Problems SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.ExersizeSections ADD
	Seq int NOT NULL CONSTRAINT DF_ExersizeSections_Seq DEFAULT 0
GO
ALTER TABLE dbo.ExersizeSections SET (LOCK_ESCALATION = TABLE)
GO
COMMIT