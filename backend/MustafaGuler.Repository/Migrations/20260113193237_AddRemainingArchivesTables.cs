using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustafaGuler.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddRemainingArchivesTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Animes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Episodes = table.Column<int>(type: "integer", nullable: true),
                    ReleaseYear = table.Column<int>(type: "integer", nullable: true),
                    Studio = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CoverImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MyReview = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    MyRating = table.Column<int>(type: "integer", nullable: true),
                    ConsumedYear = table.Column<int>(type: "integer", nullable: true),
                    ExternalId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Animes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Platform = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Developer = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ReleaseYear = table.Column<int>(type: "integer", nullable: true),
                    PlaytimeHours = table.Column<int>(type: "integer", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CoverImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MyReview = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    MyRating = table.Column<int>(type: "integer", nullable: true),
                    ConsumedYear = table.Column<int>(type: "integer", nullable: true),
                    ExternalId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Musics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Artist = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Album = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ReleaseYear = table.Column<int>(type: "integer", nullable: true),
                    Genre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SpotifyId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CoverImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MyReview = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    MyRating = table.Column<int>(type: "integer", nullable: true),
                    ConsumedYear = table.Column<int>(type: "integer", nullable: true),
                    ExternalId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Musics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TTRPGs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    System = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CampaignName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CampaignStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SessionCount = table.Column<int>(type: "integer", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CoverImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MyReview = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    MyRating = table.Column<int>(type: "integer", nullable: true),
                    ConsumedYear = table.Column<int>(type: "integer", nullable: true),
                    ExternalId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TTRPGs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TvSeries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StartYear = table.Column<int>(type: "integer", nullable: true),
                    EndYear = table.Column<int>(type: "integer", nullable: true),
                    TotalSeasons = table.Column<int>(type: "integer", nullable: true),
                    TotalEpisodes = table.Column<int>(type: "integer", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CoverImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MyReview = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    MyRating = table.Column<int>(type: "integer", nullable: true),
                    ConsumedYear = table.Column<int>(type: "integer", nullable: true),
                    ExternalId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TvSeries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Animes_Title",
                table: "Animes",
                column: "Title",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_Title_Platform",
                table: "Games",
                columns: new[] { "Title", "Platform" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Musics_Title_Artist",
                table: "Musics",
                columns: new[] { "Title", "Artist" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TTRPGs_Title_System",
                table: "TTRPGs",
                columns: new[] { "Title", "System" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TvSeries_Title",
                table: "TvSeries",
                column: "Title",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Animes");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Musics");

            migrationBuilder.DropTable(
                name: "TTRPGs");

            migrationBuilder.DropTable(
                name: "TvSeries");
        }
    }
}
