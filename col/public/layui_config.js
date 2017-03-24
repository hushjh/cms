layui.config({
    base: '' //假设这是test.js所在的目录
}).extend({ //设定模块别名
    grid: 'js/grid', //如果test.js是在根目录，也可以不用设定别名
    global: 'public/constant',
    index_index: 'function/index/index',
    index_nav_top: 'function/index/nav_top',
    index_nav_left: 'function/index/nav_left',
    index_right: 'function/index/right',
    page_index: 'function/page/index',
    page_toolbar: 'function/page/toolbar',
    page_list: 'function/page/list'
    //相对于上述base目录的子目录
});