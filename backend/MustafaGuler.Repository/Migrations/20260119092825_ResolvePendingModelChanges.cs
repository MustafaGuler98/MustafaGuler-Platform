using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustafaGuler.Repository.Migrations
{
    /// <inheritdoc />
    public partial class ResolvePendingModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TvSeries_Title",
                table: "TvSeries");

            migrationBuilder.DropIndex(
                name: "IX_TTRPGs_Title_System",
                table: "TTRPGs");

            migrationBuilder.DropIndex(
                name: "IX_Musics_Title_Artist",
                table: "Musics");

            migrationBuilder.DropIndex(
                name: "IX_Movies_Title_Director",
                table: "Movies");

            migrationBuilder.DropIndex(
                name: "IX_Images_FileName",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Games_Title_Platform",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_FeaturedActivities_ActivityType",
                table: "FeaturedActivities");

            migrationBuilder.DropIndex(
                name: "IX_Books_Title_Author",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_Articles_Slug",
                table: "Articles");

            migrationBuilder.DropIndex(
                name: "IX_Animes_Title",
                table: "Animes");

            migrationBuilder.CreateIndex(
                name: "IX_TvSeries_Title",
                table: "TvSeries",
                column: "Title",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_TTRPGs_Title_System",
                table: "TTRPGs",
                columns: new[] { "Title", "System" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Musics_Title_Artist",
                table: "Musics",
                columns: new[] { "Title", "Artist" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Movies_Title_Director",
                table: "Movies",
                columns: new[] { "Title", "Director" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Images_FileName",
                table: "Images",
                column: "FileName",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Games_Title_Platform",
                table: "Games",
                columns: new[] { "Title", "Platform" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturedActivities_ActivityType",
                table: "FeaturedActivities",
                column: "ActivityType",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Books_Title_Author",
                table: "Books",
                columns: new[] { "Title", "Author" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_Slug",
                table: "Articles",
                column: "Slug",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Animes_Title",
                table: "Animes",
                column: "Title",
                unique: true,
                filter: "\"IsDeleted\" = false");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TvSeries_Title",
                table: "TvSeries");

            migrationBuilder.DropIndex(
                name: "IX_TTRPGs_Title_System",
                table: "TTRPGs");

            migrationBuilder.DropIndex(
                name: "IX_Musics_Title_Artist",
                table: "Musics");

            migrationBuilder.DropIndex(
                name: "IX_Movies_Title_Director",
                table: "Movies");

            migrationBuilder.DropIndex(
                name: "IX_Images_FileName",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Games_Title_Platform",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_FeaturedActivities_ActivityType",
                table: "FeaturedActivities");

            migrationBuilder.DropIndex(
                name: "IX_Books_Title_Author",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_Articles_Slug",
                table: "Articles");

            migrationBuilder.DropIndex(
                name: "IX_Animes_Title",
                table: "Animes");

            migrationBuilder.CreateIndex(
                name: "IX_TvSeries_Title",
                table: "TvSeries",
                column: "Title",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TTRPGs_Title_System",
                table: "TTRPGs",
                columns: new[] { "Title", "System" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Musics_Title_Artist",
                table: "Musics",
                columns: new[] { "Title", "Artist" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Movies_Title_Director",
                table: "Movies",
                columns: new[] { "Title", "Director" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_FileName",
                table: "Images",
                column: "FileName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_Title_Platform",
                table: "Games",
                columns: new[] { "Title", "Platform" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeaturedActivities_ActivityType",
                table: "FeaturedActivities",
                column: "ActivityType",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Books_Title_Author",
                table: "Books",
                columns: new[] { "Title", "Author" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Articles_Slug",
                table: "Articles",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Animes_Title",
                table: "Animes",
                column: "Title",
                unique: true);
        }
    }
}
