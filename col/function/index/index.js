layui.define(function (exports) {
    var obj = function () {
        this.init = function () {
            //$(".top").load("view/index/nav_top.html");
            //$(".left").load("view/index/nav_left.html");
            //$(".right").load("view/index/right.html");
            layui.use(['index_nav_top', 'index_nav_left', 'index_right'], function () {
                var Top = layui.index_nav_top;
                var Left = layui.index_nav_left;
                var Right = layui.index_right;
                var top = new Top();
                var left = new Left();
                var right = new Right();
                top.init();
                left.init();
                right.init();

            });
        };
    }
    exports("index_index",obj);
});