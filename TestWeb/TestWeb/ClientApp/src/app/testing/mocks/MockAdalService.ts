export class MockAdalService {
    userInfo = {
        authenticated: true,
        userName: 'chris.green@hearings.net',
        token: 'token'
    };
    init() {}
    handleWindowCallback() {}
    login() {}
    logOut() {}
    setAuthenticated(flag: boolean) {
        this.userInfo.authenticated = flag;
    }
}
