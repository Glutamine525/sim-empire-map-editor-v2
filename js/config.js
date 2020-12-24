class Config {
    constructor() {
        this.version = "V2.2";
        this.core = "default";

        this.isMouseDown = false;
        this.dragMap = {
            startScrollLeft: -1,
            startScrollTop: -1,
            startX: -1,
            startY: -1,
            nowX: -1,
            nowY: -1,
            isDragging: false,
        };
        this.lastHover = {};
        this.startX = -1;
        this.startY = -1;
        this.startLi = -1;
        this.startCo = -1;
        this.nowScrollX = -1;
        this.nowScrollY = -1;

        this.isCtrlDown = false;

        this.topNavHeight = 40;
        this.sideNavWidth = 64;

        this.isPanelShowed = false;
        this.woodNum = 5;
        this.civil = "中国";
        this.isNoWood = false;
        this.isLightMode = true;
        this.showMiniMap = true;
        this.isMapRotated = false;
        this.showEffect = true;

        this.operation = "null";
        this.holding = {};
        this.newHold = false;

        this.roadCache = [];

        this.civilBuilding = {
            中国: BuildingChina,
            波斯: BuildingPersian,
            埃及: BuildingEgypt,
            希腊: BuildingGreece,
            阿兹特克: BuildingAztaka,
        };
        this.protection = this.civilBuilding["中国"]["防"];
        this.protectionFull = this.civilBuilding["中国"]["防护"];
    }
}
