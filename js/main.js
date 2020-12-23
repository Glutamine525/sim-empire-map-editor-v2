var $length = 116;
var $cellSize = 30;

var $topNav = new TopNav(40);
var $sideNav = new SideNav(64);
var $cell = {};
var $range = new BuildingRange({});
var $miniMap = new MiniMap();
var $selectionBlock = new SelectionBlock();
var $deletionBlock = new DeletionBlock();

if (navigator.userAgent.indexOf("AppleWebKit") > -1 && !window.chrome) {
    $config.core = "safari";
}

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
    $$("editor").style.top = `${20 + $config.topNavHeight}px`;
    $$("editor").style.height = `calc(100% - ${60 + $config.topNavHeight}px)`;
});
topNavResizeObserver.observe($$("top-nav-height-helper"));

const userSignPreviewResizeObserver = new ResizeObserver((entries) => {
    let height = 0;
    for (let entry of entries) {
        height = entry.contentRect.height;
    }
    if ($$("ham-button").className.baseVal.indexOf("active") > -1) {
        $$("sign").style.transform = `scale(${height / 3480})`;
        $$("sign").style.msTransform = `scale(${height / 3480})`;
        $$("sign").style.webkitTransform = `scale(${height / 3480})`;
    }
});
userSignPreviewResizeObserver.observe($$("user-sign-map-preview"));

initCell();
$miniMap.init();
onClickDisplayMode(true);
drawBoundary("black");
drawCell(getColor("--color-border-lighter"), getColor("--color-background-lighter"));
onClickWoodNum(5);
$$("top-nav-version").innerHTML = $config.version;
$$("sign-version").innerHTML = $config.version;
$$("sign-civil").innerHTML = "中国";

if (
    "backdrop-filter" in document.documentElement.style ||
    "-webkit-backdrop-filter" in document.documentElement.style
) {
    // if (false) {
    $config.isFtosted = true;
    let topNav = $$("top-nav");
    topNav.style.background = "transparent";
    topNav.style.backdropFilter = "blur(15px)";
    topNav.style.webkitBackdropFilter = "blur(15px)";
    topNav.style.margin = "4px";
    topNav.style.borderRadius = "20px";
    topNav.style.border = "1px solid var(--color-border-darker)";
    topNav.style.width = "calc(100% - 10px)";
    topNav.style.boxShadow = "0 0 5px var(--color-border-base)";
    topNav.style.webkitBoxShadow = "0 0 5px var(--color-border-base)";
    $$("side-nav").style.background = "transparent";
    $$("side-nav").style.width = "66px";
    $$("side-nav").style.display = "flex";
    if ($config.core === "safari") $$("side-nav").style.display = "-webkit-box";
    $$("side-nav").style.flexDirection = "column";
    $$("side-nav").style.webkitBoxOrient = "vertical";
    $$("side-nav").style.webkitBoxDirection = "normal";
    $$("side-nav").style.msFlexDirection = "column";
    $$$("#side-nav > .side-nav-container").style.width = "86px";
    $$$("#side-nav > .side-nav-container").style.margin = "auto 0";
    let sideMenu = $$$("#side-nav > .side-nav-container > .el-menu");
    sideMenu.style.width = "46px";
    sideMenu.style.margin = "4px 0 4px 4px";
    sideMenu.style.border = "1px solid var(--color-border-darker)";
    sideMenu.style.borderRadius = "23px";
    sideMenu.style.backdropFilter = "blur(15px)";
    sideMenu.style.webkitBackdropFilter = "blur(15px)";
    sideMenu.style.boxShadow = "0 0 5px var(--color-border-base)";
    sideMenu.style.webkitBoxShadow = "0 0 5px var(--color-border-base)";
    $$$("#side-nav .el-submenu__title", true).forEach((v) => {
        v.style.borderRadius = "23px";
    });
    $$$("#side-nav .el-menu--collapse > .el-menu-item", true).forEach((v) => {
        v.style.borderRadius = "23px";
    });
    $topNav.setHeight($config.height);
    $config.topNavHeight += 8;
    $sideNav.setMaginTop($config.height);
} else {
    $$("top-nav").style.background = "var(--color-background-darker)";
    $$("side-nav").style.background = "var(--color-background-darker)";
    $$("side-nav").style.boxShadow = "3px 3px 5px var(--color-border-base)";
    $$("side-nav").style.webkitBoxShadow = "3px 3px 5px var(--color-border-base)";
    $$$("#side-nav > .side-nav-container").style.height = "100%";
    $$$("#side-nav .side-nav-container").style.display = "flex";
    if ($config.core === "safari") $$$("#side-nav .side-nav-container").style.display = "-webkit-box";
    $$$("#side-nav .el-menu--collapse").style.margin = "auto 0";
}

let centerTop = (3480 + 72 + 32 - window.innerHeight) / 2;
let centerLeft = (3480 + 96 + 32 - window.innerWidth) / 2;

$$("app").style.display = "block";
window.scrollTo({
    top: centerTop,
    left: centerLeft,
    behavior: "smooth",
});

$$("ghost-container").style.display = "none";
$$("loading-background-container").style.display = "none";

document.onclick = onMouseClick;
document.onmousemove = onMouseMove;
document.onmousedown = onMouseDown;
document.onmouseup = onMouseUp;
document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;
document.onscroll = onScroll;
window.onresize = onResize;
document.body.oncontextmenu = () => {
    window.event.returnValue = false;
    return false;
};
