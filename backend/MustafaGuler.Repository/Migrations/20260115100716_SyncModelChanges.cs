using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustafaGuler.Repository.Migrations
{
    /// <inheritdoc />
    public partial class SyncModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeaturedRecords");

            migrationBuilder.CreateTable(
                name: "FeaturedActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ActivityType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SelectedItemId = table.Column<Guid>(type: "uuid", nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeaturedActivities", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FeaturedActivities_ActivityType",
                table: "FeaturedActivities",
                column: "ActivityType",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeaturedActivities");

            migrationBuilder.CreateTable(
                name: "FeaturedRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    RecordType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SelectedItemId = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeaturedRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FeaturedRecords_RecordType",
                table: "FeaturedRecords",
                column: "RecordType",
                unique: true);
        }
    }
}
