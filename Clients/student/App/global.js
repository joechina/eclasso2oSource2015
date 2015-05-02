define(['knockout','data'], function (ko,data) {
    function routes() {
        var routes = [
                    { route: '', moduleId: 'home', title: '主页', nav: 1 },
                    { route: 'signin', moduleId: 'signin', title: '登录', nav: 0 },
                    { route: 'signup', moduleId: 'signup', title: '免费注册', nav: 0 },
                    { route: 'newmsg', moduleId: 'newmsg', title: '新消息', nav: 1 },
                    { route: 'newclazz', moduleId: 'newclazz',title:'新添课程', nav:3},
                    { route: 'problem/:id', moduleId: 'problem', title: '问题', nav: 2 },
                    { route: 'myprofile', moduleId: 'myprofile', title: '个人信息', nav: 3 },
                    { route: 'editprofile', moduleId: 'editprofile', title: '编辑个人信息', nav: 3 },
                    { route: 'announcements', moduleId: 'announcement', title: '通知', nav: 11 },
                    { route: 'exersizes', moduleId: 'exersize', title: '练习题', nav: 12 },
                    { route: 'questions', moduleId: 'question', title: '知识库', nav: 13 },
                    { route: 'settings', moduleId: 'setting', title: '我', nav: 14 },
                    { route: 'uploadEx', moduleId: 'uploadEx', title: '上传习题', nav: 15 },
                    { route: 'uploadQA', moduleId: 'uploadQA', title: '上传答疑', nav: 16 },
                    { route: 'clazz', moduleId: 'clazz', title: '课程管理', nav: 17 },
                    { route: 'report', moduleId: 'report', title: '习题报告', nav: 18 },
            ];

        return routes
    }
    return {
        data:data,
        routes: new routes(),
        quiztypename: quiztypename
    }

    function quiztypename(id) {
        // 0 - 纯文本填空题，1-单选题， 2-是非题，3-多选题, 4-html 填空题
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
            case 4:
                return 'htmlfillblank';
                break;
        }
    }
});