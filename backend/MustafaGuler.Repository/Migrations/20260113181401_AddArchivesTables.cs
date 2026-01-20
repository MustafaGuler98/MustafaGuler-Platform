using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustafaGuler.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddArchivesTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Author = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PageCount = table.Column<int>(type: "integer", nullable: true),
                    PublishYear = table.Column<int>(type: "integer", nullable: true),
                    ReadingStatus = table.Column<int>(type: "integer", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CoverImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MyReview = table.Column<string>(type: "text", nullable: true),
                    MyRating = table.Column<int>(type: "integer", nullable: true),
                    ConsumedYear = table.Column<int>(type: "integer", nullable: true),
                    ExternalId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Director = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ReleaseYear = table.Column<int>(type: "integer", nullable: true),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CoverImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MyReview = table.Column<string>(type: "text", nullable: true),
                    MyRating = table.Column<int>(type: "integer", nullable: true),
                    ConsumedYear = table.Column<int>(type: "integer", nullable: true),
                    ExternalId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Quotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Author = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Source = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quotes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Books_Title_Author",
                table: "Books",
                columns: new[] { "Title", "Author" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Movies_Title_Director",
                table: "Movies",
                columns: new[] { "Title", "Director" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Quotes_Author",
                table: "Quotes",
                column: "Author");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books");

            migrationBuilder.DropTable(
                name: "Movies");

            migrationBuilder.DropTable(
                name: "Quotes");
        }
    }
}
