namespace TestWeb.AcceptanceTests.Hooks
{
    internal enum HooksSequence
    {
        CleanUpDriverInstances,
        ConfigHooks,
        RegisterApisHooks,
        HealthcheckHooks,
        InitialiseBrowserHooks,
        ConfigureDriverHooks,
        SetTimeZone,
        SignOutHooks,
        LogResultHooks,
        TearDownBrowserHooks,
        RemoveDataHooks
    }
}
