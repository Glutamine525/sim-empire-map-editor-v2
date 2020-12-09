var $length = 116;
var $cellSize = 30;

var $topNav = new TopNav(40);
var $sideNav = new SideNav(64);
var $config = new Config();

const topNavResizeObserver = new ResizeObserver((entries) => {
    let height = 0;
    for (let entry of entries) {
        height = entry.contentRect.height;
    }
    if (height <= 40) height = 40;
    else height += 20;
    $topNav.setHeight(height);
    if ($config.isFtosted) height += 8;
    $sideNav.setMaginTop(height);
    $config.topNavHeight = height;
});
topNavResizeObserver.observe($$("top-nav-height-helper"));

onClickDisplayMode(true);
drawBoundary("black");
drawCell(getColor("--color-border-lighter"), getColor("--color-background-lighter"));

if ("backdrop-filter" in document.documentElement.style) {
    // if (false) {
    $config.isFtosted = true;
    let topNav = $$("top-nav");
    topNav.style.background = "transparent";
    topNav.style.backdropFilter = "blur(15px)";
    topNav.style.margin = "4px";
    topNav.style.borderRadius = "20px";
    topNav.style.border = "1px solid var(--color-border-darker)";
    topNav.style.width = "calc(100% - 10px)";
    $$("side-nav").style.background = "transparent";
    let sideMenu = $$$("#side-nav .el-menu");
    sideMenu.style.width = "56px";
    sideMenu.style.margin = "0 0 4px 4px";
    sideMenu.style.border = "1px solid var(--color-border-darker)";
    sideMenu.style.borderRadius = "20px";
    sideMenu.style.backdropFilter = "blur(15px)";
    $$$("#side-nav .el-submenu__title", true).forEach((v) => {
        v.style.borderRadius = "20px";
    });
    $$$("#side-nav .el-menu-item", true).forEach((v) => {
        v.style.borderRadius = "20px";
    });
    $topNav.setHeight($config.height);
    $config.topNavHeight += 8;
    $sideNav.setMaginTop($config.height);
} else {
    $$("top-nav").style.background = "var(--color-background-darker)";
    $$("side-nav").style.background = "var(--color-background-darker)";
    $$("side-nav").style.boxShadow = "3px 3px 5px var(--color-border-base)";
}
