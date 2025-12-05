using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MustafaGuler.Repository.Migrations
{
    /// <inheritdoc />
    public partial class SeedDataAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Articles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "LanguageCode",
                table: "Articles",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.InsertData(
                table: "Articles",
                columns: new[] { "Id", "Content", "CreatedDate", "GroupId", "IsDeleted", "LanguageCode", "TestDescription", "Title", "UpdatedDate", "ViewCount" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Onion Architecture, yazılım projelerinde bağımlılıkları yönetmek için...", new DateTime(2023, 10, 1, 12, 0, 0, 0, DateTimeKind.Utc), new Guid("99999999-9999-9999-9999-999999999999"), false, "tr", null, "Onion Architecture Nedir?", null, 100 },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Onion Architecture is a layered architecture pattern...", new DateTime(2023, 10, 1, 12, 0, 0, 0, DateTimeKind.Utc), new Guid("99999999-9999-9999-9999-999999999999"), false, "en", null, "What is Onion Architecture?", null, 50 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Articles",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "LanguageCode",
                table: "Articles",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(5)",
                oldMaxLength: 5);
        }
    }
}
