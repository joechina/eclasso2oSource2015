define(['knockout','data'], function (ko,data) {
    function routes() {
        var routes = [
                    { route: '', moduleId: 'home', title: 'Home', nav: 1 },
                    { route: 'signin', moduleId: 'signin', title: 'Sign In', nav: 0 },
                    { route: 'signup', moduleId: 'signup', title: 'Register', nav: 0 },
                    { route: 'newmsg', moduleId: 'newmsg', title: 'New Message', nav: 0 },
                    { route: 'problem/:id', moduleId: 'problem', title: 'Problem', nav: 2 },
                    { route: 'announcements', moduleId: 'announcement', title: 'Inbox', nav: 11 },
                    { route: 'exersizes', moduleId: 'exersize', title: 'Exersizes', nav: 12 },
                    { route: 'questions', moduleId: 'question', title: 'Q&A', nav: 13 },
                    { route: 'settings', moduleId: 'setting', title: 'Me', nav: 14 },
                    { route: 'test', moduleId: 'test', title: 'Test Mp3', nav: 15 }
                    ];
        return routes
    }
    return {
        data:data,
        routes: new routes()
    }
});