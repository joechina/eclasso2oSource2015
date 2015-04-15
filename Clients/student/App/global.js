define(['knockout','data'], function (ko,data) {
    function routes() {
        var routes = [
                    { route: '', moduleId: 'home', title: '主页', nav: 1 },
                    { route: 'signin', moduleId: 'signin', title: '登录', nav: 0 },
                    { route: 'signup', moduleId: 'signup', title: '免费注册', nav: 0 },
                    { route: 'newmsg', moduleId: 'newmsg', title: '新消息', nav: 1 },
                    { route: 'problem/:id', moduleId: 'problem', title: '问题', nav: 2 },
                    { route: 'announcements', moduleId: 'announcement', title: '通知', nav: 11 },
                    { route: 'exersizes', moduleId: 'exersize', title: '练习题', nav: 12 },
                    { route: 'questions', moduleId: 'question', title: '知识库', nav: 13 },
                    { route: 'settings', moduleId: 'setting', title: '我', nav: 14 },
                    { route: 'uploadEx', moduleId: 'uploadEx', title: '上传习题', nav: 15 },
                    { route: 'uploadQA', moduleId: 'uploadQA', title: '上传答疑', nav: 16 }
                    ];
        return routes
    }
    return {
        data:data,
        routes: new routes(),
        quiztypename: quiztypename
    }

    function quiztypename(id) {
        // 0 - 填空题，1-单选题， 2-是非题，3-多选题
        switch (id) {
            case 0:
                return 'fillblank';
                break;
            case 1:
                return 'singleselection';
                break;
            case 2:
                return 'truefalse';
                break;
            case 3:
                return 'multiselection';
                break;
        }
    }
});