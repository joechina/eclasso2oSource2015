define(['knockout','data'], function (ko,data) {
    function routes() {
        var routes = [
                    { route: '', moduleId: 'home', title: '主页', nav: 1 },
                    { route: 'signin', moduleId: 'signin', title: 'Parrot 学生版', nav: 0 },
                    { route: 'signup', moduleId: 'signup', title: '免费注册', nav: 0 },
                    { route: 'newmsg', moduleId: 'newmsg', title: '新消息', nav: 1 },
                    { route: 'newclazz', moduleId: 'newclazz',title:'新添课程', nav:3},
                    { route: 'problem/:id', moduleId: 'problem', title: '问题', nav: 2 },
                    { route: 'myprofile', moduleId: 'myprofile', title: '个人信息', nav: 3 },
                    { route: 'uploadEx/:id', moduleId: 'uploadEx', title: '上传/编辑习题', nav: 3 },
                    { route: 'editprofile', moduleId: 'editprofile', title: '编辑个人信息', nav: 3 },
                    { route: 'setting', moduleId: 'setting', title:'设置', nav: 3},
                    { route: 'myclazz', moduleId: 'myclazz', title: '我的课程', nav: 3 },
                    { route: 'password', moduleId: 'password', title: '修改密码', nav: 3 },
                    { route: 'feedback', moduleId: 'feedback', title: '用户反馈', nav: 3 },
                    { route: 'myreport', moduleId: 'myreport', title: '我的习题报告', nav: 3 },
                    { route: 'ex_shell', moduleId: 'ex_shell', title: '新习题库', icon: 'ion-ios-bell', nav: 3 },
                    { route: 'ex_alterego', moduleId: 'ex_alterego', title: 'Alter Ego+', nav: 3 },
                    { route: 'ex_reflets', moduleId: 'ex_reflets', title: 'Reflets', nav: 3 },
                    { route: 'ex_saison', moduleId: 'ex_saison', title: 'Saison',  nav: 3 },
                    { route: 'announcements', moduleId: 'announcement', title: '通知', icon: 'icon ion-ios-bell-outline', nav: 11 },
                    { route: 'exersizes/:uid', moduleId: 'exersize', title: '习题库', icon: 'icon ion-ios-list-outline', nav: 12 },
                    { route: 'questions', moduleId: 'question', title: '知识库', icon: 'icon ion-ios-book-outline', nav: 13 },
                    { route: 'me', moduleId: 'me', title: '我', icon: 'icon ion-ios-person-outline', nav: 14 },
                    { route: 'report', moduleId: 'report', title: '习题报告', nav: 3 },
                    { route: 'joinclazz', moduleId: 'joinclazz', title: '所有课程', nav: 3 },

            ];

        return routes
    }
    return {
        data:data,
        routes: new routes(),
        quiztypename: quiztypename,
        categories: [{ value: 0, label: 'Alter Ego+' },
                        { value: 1, label: 'Reflets' },
                        { value: 2, label: 'Saison' },]
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