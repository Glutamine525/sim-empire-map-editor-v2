function onScroll(event) {
    $miniMap.updateFocus();
}

function onResize(event) {
    $miniMap.resizeFocus();
}

function onDragStartCivilBuildingTag(event, self) {
    $config.dragCivilBuildingTagID = self.parentNode.id;
}

function onDragOverCivilBuildingTag(event, self) {
    let startID = $config.dragCivilBuildingTagID.split("-");
    let selfID = self.parentNode.id.split("-");
    if (startID[3] === selfID[3]) event.preventDefault();
}

function onDropCivilBuildingTag(event, self, dir) {
    let startID = $config.dragCivilBuildingTagID.split("-");
    let selfID = self.parentNode.id.split("-");
    if (startID[3] === selfID[3]) {
        let selfIndex = +selfID[4];
        let startIndex = +startID[4];
        if (startIndex === selfIndex) {
            $config.dragCivilBuildingTagID = "";
            return;
        }
        if (startIndex - selfIndex === -1 && dir === "left") {
            $config.dragCivilBuildingTagID = "";
            return;
        }
        if (startIndex - selfIndex === 1 && dir === "right") {
            $config.dragCivilBuildingTagID = "";
            return;
        }
        event.preventDefault();
        let index = +startID[3];
        let startObj = $vm.civilEditorResult[$vm.civilEditorStepLabel[index]][startIndex];
        if (dir === "left" && startIndex < selfIndex) {
            $vm.civilEditorResult[$vm.civilEditorStepLabel[index]].splice(selfIndex, 0, startObj);
            $vm.civilEditorResult[$vm.civilEditorStepLabel[index]].splice(startIndex, 1);
        } else if (dir === "left" && startIndex > selfIndex) {
            $vm.civilEditorResult[$vm.civilEditorStepLabel[index]].splice(startIndex, 1);
            $vm.civilEditorResult[$vm.civilEditorStepLabel[index]].splice(selfIndex, 0, startObj);
        } else if (dir === "right" && startIndex < selfIndex) {
            $vm.civilEditorResult[$vm.civilEditorStepLabel[index]].splice(selfIndex + 1, 0, startObj);
            $vm.civilEditorResult[$vm.civilEditorStepLabel[index]].splice(startIndex, 1);
        } else if (dir === "right" && startIndex > selfIndex) {
            $vm.civilEditorResult[$vm.civilEditorStepLabel[index]].splice(startIndex, 1);
            $vm.civilEditorResult[$vm.civilEditorStepLabel[index]].splice(selfIndex + 1, 0, startObj);
        }
    }
    $config.dragCivilBuildingTagID = "";
}
