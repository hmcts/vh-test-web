rmdir /q /s Artifacts

SET exclude=\"[TestWeb]TestWeb.ConfigureServicesExtensions,[TestWeb]TestWeb.Program,[TestWeb]TestWeb.Startup,[*]TestWeb.Common.*,[*]TestWeb.Extensions.*,[*]TestWeb.Pages.*,[*]TestWeb.Swagger.*,[*]TestWeb.Views.*,[*]TestWeb.UnitTests.*,[*]TestWeb.Services.*,[*]Testing.Common.*,[*]TestWeb.UnitTests.*"
dotnet test TestWeb/TestWeb/TestWeb.UnitTests/TestWeb.UnitTests.csproj /p:CollectCoverage=true /p:CoverletOutputFormat="\"opencover,cobertura,json,lcov\"" /p:CoverletOutput=../Artifacts/Coverage/ /p:MergeWith='../Artifacts/Coverage/coverage.json' /p:Exclude="${exclude}"

reportgenerator -reports:Artifacts/Coverage/coverage.opencover.xml -targetDir:Artifacts/Coverage/Report -reporttypes:HtmlInline_AzurePipelines

"Artifacts/Coverage/Report/index.htm"