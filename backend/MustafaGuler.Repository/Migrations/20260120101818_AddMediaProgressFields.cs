using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MustafaGuler.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaProgressFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CurrentEpisode",
                table: "TvSeries",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentPage",
                table: "Books",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentEpisode",
                table: "Animes",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentEpisode",
                table: "TvSeries");

            migrationBuilder.DropColumn(
                name: "CurrentPage",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "CurrentEpisode",
                table: "Animes");
        }
    }
}
