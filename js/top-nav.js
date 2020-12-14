class TopNav {
    constructor(height) {
        this.height = height;
        this.id = "top-nav";
        $$(this.id).style.height = `${this.height}px`;
    }

    setHeight(height) {
        this.height = height;
        $$(this.id).style.height = `${this.height}px`;
    }

    getHeight() {
        return this.height;
    }

    setWoodNum(woodNum) {
        woodNum = woodNum || $config.woodNum;
        $$("wood-num").innerHTML = woodNum;
    }

    getWoodNum() {
        return +$$("wood-num").innerHTML;
    }

    setCivil(civil) {
        civil = civil || $config.civil;
        $$("civil").innerHTML = civil;
    }

    getCivil() {
        return $$("civil").innerHTML;
    }

    setSelected(selected) {
        selected = selected || $config.selected;
        $$("top-nav-selected").innerHTML = selected;
    }

    setOperation(operation) {
        operation = operation || $config.operation;
        $$("top-nav-holding").innerHTML = operation;
    }
}

function onClickHamButton(checked) {
    if (!checked) {
        // popup
        $config.nowScrollX = $$$("html").scrollLeft;
        $config.nowScrollY = $$$("html").scrollTop;
        $config.isPanelShowed = true;
        $$("editor-container").style.left = "0";
        $$("main-page").style.filter = "blur(5px)";
        $$("main-page").style.overflow = "hidden";
        $$("editor").style.top = `${20 + $config.topNavHeight}px`;
        $$("editor").style.height = `calc(100% - ${60 + $config.topNavHeight}px)`;
    } else {
        // disappear
        $config.isPanelShowed = false;
        $$("editor-container").style.left = "-100%";
        $$("main-page").style.removeProperty("filter");
        $$("main-page").style.removeProperty("overflow");
        window.scrollTo({
            left: $config.nowScrollX,
            top: $config.nowScrollY,
            behavior: "smooth",
        });
    }
    $$("ham-button").classList.toggle("active");
}

function onClickWoodNum(woodNum) {
    $$$("#wood-num + ul li", true).forEach((node) => (node.style.display = "none"));
    if (+woodNum === $topNav.getWoodNum()) return;
    $config.woodNum = woodNum;
    $topNav.setWoodNum();
    clearBuilding();
    $miniMap.clear();
    initCell();
    drawFixedBuilding("water");
    drawFixedBuilding("mountain");
    drawFixedBuilding("road");
    drawFixedBuilding("stone");
    drawFixedBuilding("copper");
    drawFixedBuilding("wood");
    drawFixedBuilding("clay");
    drawFixedBuilding("wharf");
    if (!$config.isNoWood) onClickNoWood(false);
}

function onClickCivil(civil) {
    $$$("#civil + ul li", true).forEach((node) => (node.style.display = "none"));
    if (civil === $topNav.getCivil()) return;
    $config.civil = civil;
    $config.protection = $config.civilBuilding[civil]["防"];
    $config.protectionFull = $config.civilBuilding[civil]["防护"];
    $topNav.setCivil();
    $vm.onChangeCivil();
    $vm.onSelectOperation("取消操作", ["取消操作"]);
    $config.roadCache = [];
    $$("road-helper").style.display = "none";
    $$("preview").style.display = "none";
    $selectionBlock.hide();
    $deletionBlock.hide();
    for (let i = 1; i <= $length; i++) {
        for (let j = 1; j <= $length; j++) {
            if ($cell[i][j].occupied && !$cell[i][j].occupied.isFixed) {
                deleteBuilding(i, j);
            }
        }
    }
}

function onClickNoWood(isNoWood) {
    $config.isNoWood = isNoWood;
    if (isNoWood) {
        let building = $$("building");
        BuildingFixed["tree"][$config.woodNum - 3].map((v) => {
            let u = v.split("-").map((w) => +w);
            let id = `${v}-1`;
            delete $cell[u[0]][u[1]].occupied;
            building.removeChild($$(id));
            $miniMap.setPixel(u[0], u[1], getColor("--color-background-lighter"), 1, 1);
        });
    } else {
        BuildingFixed["tree"][$config.woodNum - 3].map((v) => {
            let u = v.split("-").map((w) => +w);
            if ($cell[u[0]][u[1]].occupied) {
                deleteBuilding(u[0], u[1], true);
            }
        });
        drawFixedBuilding("tree");
    }
}

function onClickDisplayMode(isLightMode) {
    $config.isLightMode = isLightMode;
    if (isLightMode) {
        Object.keys(LightMode).forEach((v) => {
            document.body.style.setProperty(`--${v}`, LightMode[v]);
        });
    } else {
        Object.keys(DarkMode).forEach((v) => {
            document.body.style.setProperty(`--${v}`, DarkMode[v]);
        });
    }
    drawCell(getColor("--color-border-lighter"), getColor("--color-background-lighter"));
    $miniMap.onChangeDisplayMode();
}

function onClickMiniMap(show) {
    $config.showMiniMap = show;
    if (show) {
        $$("mini-map").style.display = "block";
        $$("mini-map-focus").style.display = "block";
        $$("mini-map-container").style.width = "182px";
        $$("mini-map-container").style.height = "182px";
        $$("mini-map-container").style.border = "1px solid var(--color-border-darker)";
    } else {
        $$("mini-map").style.display = "none";
        $$("mini-map-focus").style.display = "none";
        $$("mini-map-container").style.width = "0";
        $$("mini-map-container").style.height = "0";
        $$("mini-map-container").style.border = "none";
    }
}

function minionEyeballs(event) {
    let eyes = document.querySelectorAll("#minion .eye");
    eyes.forEach(function (eye) {
        let x = eye.getBoundingClientRect().left + eye.clientLeft / 2;
        let y = eye.getBoundingClientRect().top + eye.clientTop / 2;
        let radian = Math.atan2(event.clientX - x, event.clientY - y);
        let rot = radian * (180 / Math.PI) * -1 + 270;
        eye.style.transform = "rotate(" + rot + "deg)";
    });
}
