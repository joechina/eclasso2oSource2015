define(['knockout','data'], function (ko,data) {
    function routes() {
        var routes = [
                    { route: '', moduleId: 'home', title: '主页', nav: 1 },
                    { route: 'signin', moduleId: 'signin', title: 'Parrot 老师版', nav: 0 },
                    { route: 'signup', moduleId: 'signup', title: '免费注册', nav: 0 },
                    { route: 'newmsg', moduleId: 'newmsg', title: '新消息', icon: 'glyphicon glyphicon-bell', nav: 10},
                    { route: 'newclazz', moduleId: 'newclazz',title:'新添课程', nav:3},
                    { route: 'problem/:id', moduleId: 'problem', title: '问题', nav: 2 },
                    { route: 'myprofile', moduleId: 'myprofile', title: '个人信息', nav: 3 },
                    { route: 'uploadEx/:id', moduleId: 'uploadEx', title: '上传/编辑习题', nav: 3 },
                    { route: 'editprofile', moduleId: 'editprofile', title: '编辑个人信息', nav: 3 },
                    { route: 'setting', moduleId: 'setting', title:'设置', nav: 3},
                    { route: 'myclazz', moduleId: 'myclazz', title: '我的课程', nav: 3 },
                    { route: 'password', moduleId: 'password', title: '修改密码', nav: 3 },
                    { route: 'feedback', moduleId: 'feedback', title: '用户反馈', nav: 3 },
                    { route: 'msgEx', moduleId: 'msgEx', title: '习题管理', icon: 'glyphicon glyphicon-bell', nav: 11 },
                    { route: 'uploadQA', moduleId: 'uploadQA', title: '答疑管理', icon: 'glyphicon glyphicon-bell', nav: 12 },
                    { route: 'msgclazz', moduleId: 'msgclazz', title: '课程管理', icon: 'glyphicon glyphicon-bell', nav: 13 },
                    { route: 'editclazz', moduleId: 'editclazz', title: '编辑课程', icon: '', nav: 3 },
                    { route: 'report', moduleId: 'report', title: '习题报告', icon: 'glyphicon glyphicon-bell', nav: 14},
                    { route: 'exersizeassign/:eid', moduleId: 'exersizeassign', title: '分配习题', nav: 3 },
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