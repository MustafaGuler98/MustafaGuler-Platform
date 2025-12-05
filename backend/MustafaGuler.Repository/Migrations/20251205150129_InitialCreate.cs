using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MustafaGuler.Repository.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Category_Category_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Articles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    LanguageCode = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    ViewCount = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Articles_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Category",
                columns: new[] { "Id", "CreatedDate", "Description", "IsDeleted", "Name", "ParentId", "Slug", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2024, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Teknik makaleler.", false, "Yazılım Dünyası", null, "yazilim-dunyasi", null },
                    { new Guid("33333333-3333-3333-3333-333333333334"), new DateTime(2024, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Technical articles.", false, "Software World", null, "software-world", null },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2024, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), ".NET ve Mimari.", false, "Backend Geliştirme", new Guid("33333333-3333-3333-3333-333333333333"), "backend-gelistirme", null },
                    { new Guid("44444444-4444-4444-4444-444444444445"), new DateTime(2024, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), ".NET and Architecture.", false, "Backend Development", new Guid("33333333-3333-3333-3333-333333333334"), "backend-development", null }
                });

            migrationBuilder.InsertData(
                table: "Articles",
                columns: new[] { "Id", "CategoryId", "Content", "CreatedDate", "GroupId", "IsDeleted", "LanguageCode", "Title", "UpdatedDate", "ViewCount" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new Guid("44444444-4444-4444-4444-444444444444"), "Türkçe içerik...", new DateTime(2024, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new Guid("99999999-9999-9999-9999-999999999999"), false, "tr", "Onion Architecture Nedir?", null, 100 },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new Guid("44444444-4444-4444-4444-444444444445"), "English content...", new DateTime(2024, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new Guid("99999999-9999-9999-9999-999999999999"), false, "en", "What is Onion Architecture?", null, 50 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Articles_CategoryId",
                table: "Articles",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Category_ParentId",
                table: "Category",
                column: "ParentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Articles");

            migrationBuilder.DropTable(
                name: "Category");
        }
    }
}
