namespace TestWeb.AcceptanceTests.Hooks
{
    internal enum HooksSequence
    {
        ConfigHooks = 1,
        RegisterApisHooks = 2,
        HealthcheckHooks = 3,
        InitialiseBrowserHooks = 4,
        ConfigureDriverHooks = 5,
        SetTimeZone = 6,
        SignOutHooks = 7,
        LogResultHooks = 8,
        TearDownBrowserHooks = 9,
        RemoveDataHooks = 10
    }
}
