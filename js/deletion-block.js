class DeletionBlock extends Block {
    constructor() {
        super();
        this.id = "deletion-block";
    }

    finalize(config) {
        this.update(config);
        super.finalize(config);
        if (!this.cache.length) return;
        if (this.cache.length === 1) {
            onClickBlockDelete();
            return;
        }
        $$("deletion-operation-button").style.top = `${(this.startLi - 1) * $cellSize - 50}px`;
        $$("deletion-operation-button").style.left = `${((this.startCo + this.nowCo) / 2) * $cellSize - 35}px`;
        $$("deletion-operation-button").style.display = "block";
    }

    hide() {
        this.cache.forEach((v) => {
            $$(v).className = $$(v).className.replace(" selected-red", "");
        });
        this.cache = [];
        $$("deletion-block").style.display = "none";
        $$("deletion-operation-button").style.display = "none";
    }
}

function onClickBlockDelete() {
    for (let v of $deletionBlock.cache) {
        let u = parseID(v);
        deleteBuilding(u[0], u[1]);
    }
    $deletionBlock.cache = [];
    $deletionBlock.hide();
}
