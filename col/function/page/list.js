layui.define(function (exports) {
    var obj = function () {
        this.init = function () {
            $("#page-list").load("view/page/list.html", function () {
                layui.use(['grid', 'element', 'global'], function () {
                    var element = layui.element();
                    var global = layui.global;
                    var Grid = layui.grid;
                    console.log(Grid);
                    var grid = new Grid();
                    grid.init();
                    console.log(global.grid);
                });
            });

        };
    }
    exports("page_list", obj);
});