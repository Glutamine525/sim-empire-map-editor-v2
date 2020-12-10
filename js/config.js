class Config {
    constructor() {
        this.topNavHeight = 40;
        this.sideNavWidth = 64;
        this.woodNum = 5;
        this.civil = "中国";
        this.isNoWood = false;
        this.isLightMode = true;
        this.showMiniMap = true;
        this.isMapRotated = false;
        this.operation = "";
        this.holding = {};
        this.newHold = false;
        this.isMouseDown = false;
        this.showEffect = true;
        this.civilBuilding = {
            中国: BuildingChina,
            波斯: BuildingPersian,
            埃及: BuildingEgypt,
            希腊: BuildingGreece,
            阿兹特克: BuildingAztaka,
        };
        this.protection = this.civilBuilding["中国"]["防"];
        this.startX = -1;
        this.startY = -1;
    }
}
