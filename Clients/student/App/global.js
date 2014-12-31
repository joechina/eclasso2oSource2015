define(['knockout'], function (ko) {
    var datahost = 'http://localhost:64123/';
    function routes() {
        var routes = [
                    { route: '', moduleId: 'home', title: 'Class List', nav: 1 },
                    { route: 'signin', moduleId: 'signin', title: 'Sign In', nav: 2 },
                    { route: 'register', moduleId: 'register', title: 'Register', nav: 3 },
                    { route: 'plan(/:id)', moduleId: 'plan', title: 'Plan', nav: 4 },
                    { route: 'day(/:id)', moduleId: 'day', title: 'Day', nav: 6 },
                    { route: 'destination(/:id)', moduleId: 'destination', title: 'Destination', nav: 7 },
        ];
        return routes
    }
    return {
        datahost: datahost,
        routes: new routes()
    }
});