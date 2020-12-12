function onKeyDown(event) {
    if (event.keyCode === 17) {
        $config.isCtrlDown = true;
    }
    if (event.keyCode === 32) {
        event.preventDefault();
    }
}

function onKeyUp(event) {
    if (event.keyCode === 17) {
        $config.isCtrlDown = false;
        return;
    }
    if (event.keyCode === 32) {
        $sideNavVue.onSelectOperation("取消操作", ["取消操作"]);
    } else if (event.keyCode === 81) {
        $sideNavVue.onSelectBuilding("2x2建筑", ["通用", "2x2建筑"]);
    } else if (event.keyCode === 87) {
        $sideNavVue.onSelectBuilding("3x3建筑", ["通用", "3x3建筑"]);
    } else if (event.keyCode === 69) {
        $sideNavVue.onSelectBuilding("4x4建筑", ["通用", "4x4建筑"]);
    } else if (event.keyCode === 82) {
        $sideNavVue.onSelectBuilding("5x5建筑", ["通用", "5x5建筑"]);
    } else if (event.keyCode === 65) {
        $sideNavVue.onSelectOperation("道路", ["道路"]);
    } else if (event.keyCode === 83) {
        $sideNavVue.onSelectOperation("选中建筑", ["选中建筑"]);
    } else if (event.keyCode === 68) {
        $sideNavVue.onSelectOperation("删除建筑", ["删除建筑"]);
    } else if (event.keyCode === 90) {
        $sideNavVue.onSelectBuilding($config.protectionFull[0], ["市政", $config.protectionFull[0]]);
    } else if (event.keyCode === 88) {
        $sideNavVue.onSelectBuilding($config.protectionFull[1], ["市政", $config.protectionFull[1]]);
    } else if (event.keyCode === 67) {
        $sideNavVue.onSelectBuilding($config.protectionFull[2], ["市政", $config.protectionFull[2]]);
    } else if (event.keyCode === 86) {
        if ($config.protectionFull.length > 3)
            $sideNavVue.onSelectBuilding($config.protectionFull[3], ["市政", $config.protectionFull[3]]);
        else return;
    } else {
        return;
    }
    $$("preview").style.display = "none";
    $selectionBlock.hide();
    $deletionBlock.hide();
}
