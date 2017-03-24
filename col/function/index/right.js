layui.define(function (exports) {
    var obj = function () {
        this.init = function () {
            $(".right").load("view/index/right.html", function () {
                layui.use(['page_index', 'element'], function () {
                    var element = layui.element();
                    element.init();
                    var Index = layui.page_index;
                    index = new Index();
                    index.init();
                });
            });

        };
    }
    exports("index_right", obj);
});