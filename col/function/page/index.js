layui.define(function (exports) {
    var obj = function () {
        this.init = function () {
            $("div[lay-id='1']").load("view/page/index.html", function () {
                layui.use(['page_toolbar','page_list'], function () {
                    var Toolbar = layui.page_toolbar;
                    var List = layui.page_list;
                    var toolbar = new Toolbar();
                    var list = new List();
                    toolbar.init();
                    list.init();
                });
            });

        };
    }
    exports("page_index", obj);
});