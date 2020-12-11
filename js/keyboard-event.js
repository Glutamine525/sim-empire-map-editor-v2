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
    }
    if (event.keyCode === 32) {
        $sideNavVue.onSelectOperation("取消操作", ["取消操作"]);
        $$("preview").style.display = "none";
        $selectionBlock.hide();
        $deletionBlock.hide();
    }
}
