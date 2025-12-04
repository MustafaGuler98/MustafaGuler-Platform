FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY ["backend/MustafaGuler.Platform.slnx", "backend/"]
COPY ["backend/MustafaGuler.API/MustafaGuler.API.csproj", "backend/MustafaGuler.API/"]
COPY ["backend/MustafaGuler.Core/MustafaGuler.Core.csproj", "backend/MustafaGuler.Core/"]
COPY ["backend/MustafaGuler.Repository/MustafaGuler.Repository.csproj", "backend/MustafaGuler.Repository/"]
COPY ["backend/MustafaGuler.Service/MustafaGuler.Service.csproj", "backend/MustafaGuler.Service/"]
COPY ["backend/tests/MustafaGuler.Core.Tests/MustafaGuler.Core.Tests.csproj", "backend/tests/MustafaGuler.Core.Tests/"]
COPY ["backend/tests/MustafaGuler.Service.Tests/MustafaGuler.Service.Tests.csproj", "backend/tests/MustafaGuler.Service.Tests/"]

RUN dotnet restore "backend/MustafaGuler.API/MustafaGuler.API.csproj"

COPY . .

WORKDIR "/app/backend/MustafaGuler.API"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "MustafaGuler.API.dll"]