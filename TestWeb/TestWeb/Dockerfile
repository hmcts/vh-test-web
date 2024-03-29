FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM node:14.15-alpine AS client 
ARG skip_client_build=false 
WORKDIR /app 
COPY TestWeb/TestWeb/ClientApp . 
RUN [[ ${skip_client_build} = true ]] && echo "Skipping npm install" || npm install
RUN [[ ${skip_client_build} = true ]] && mkdir dist || npm run-script build-prod

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY TestWeb .
RUN dotnet restore --configfile nuget.config "TestWeb/TestWeb.csproj"
WORKDIR "/src/TestWeb"
RUN dotnet build "TestWeb.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TestWeb.csproj" -c Release -o /app/publish -p:PublishRunWebpack=false

FROM base AS final
RUN apt-get update && apt-get install -y curl
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=client /app/dist /app/ClientApp/dist
ENTRYPOINT ["dotnet", "TestWeb.dll"]
