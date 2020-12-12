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
        $vm.onSelectOperation("取消操作", ["取消操作"]);
    } else if (event.keyCode === 81) {
        $vm.onSelectBuilding("2x2建筑", ["通用", "2x2建筑"]);
    } else if (event.keyCode === 87) {
        $vm.onSelectBuilding("3x3建筑", ["通用", "3x3建筑"]);
    } else if (event.keyCode === 69) {
        $vm.onSelectBuilding("4x4建筑", ["通用", "4x4建筑"]);
    } else if (event.keyCode === 82) {
        $vm.onSelectBuilding("5x5建筑", ["通用", "5x5建筑"]);
    } else if (event.keyCode === 65) {
        $vm.onSelectOperation("道路", ["道路"]);
    } else if (event.keyCode === 83) {
        $vm.onSelectOperation("选中建筑", ["选中建筑"]);
    } else if (event.keyCode === 68) {
        $vm.onSelectOperation("删除建筑", ["删除建筑"]);
    } else if (event.keyCode === 90) {
        $vm.onSelectBuilding($config.protectionFull[0], ["市政", $config.protectionFull[0]]);
    } else if (event.keyCode === 88) {
        $vm.onSelectBuilding($config.protectionFull[1], ["市政", $config.protectionFull[1]]);
    } else if (event.keyCode === 67) {
        $vm.onSelectBuilding($config.protectionFull[2], ["市政", $config.protectionFull[2]]);
    } else if (event.keyCode === 86) {
        if ($config.protectionFull.length > 3)
            $vm.onSelectBuilding($config.protectionFull[3], ["市政", $config.protectionFull[3]]);
        else return;
    } else {
        return;
    }
    $$("preview").style.display = "none";
    $selectionBlock.hide();
    $deletionBlock.hide();
}
