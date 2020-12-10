class Block {
    constructor() {
        this.cache = [];
        this.id = "";
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.startLi = 0;
        this.startCo = 0;
        this.nowLi = 0;
        this.nowCo = 0;
    }

    update(config) {
        this.top = config.startY;
        this.left = config.startX;
        this.width = config.nowX - config.startX;
        this.height = config.nowY - config.startY;
        if (this.width <= 0) {
            this.width = -this.width;
            this.left -= this.width;
        }
        if (this.height <= 0) {
            this.height = -this.height;
            this.top -= this.height;
        }
        $$(this.id).style.top = `${this.top}px`;
        $$(this.id).style.left = `${this.left}px`;
        $$(this.id).style.width = `${this.width}px`;
        $$(this.id).style.height = `${this.height}px`;
        $$(this.id).style.display = "block";
    }

    finalize(config) {
        this.startLi = Math.ceil(config.startY / $cellSize);
        this.startCo = Math.ceil(config.startX / $cellSize);
        this.nowLi = Math.ceil(config.nowY / $cellSize);
        this.nowCo = Math.ceil(config.nowX / $cellSize);
        if (this.startLi > this.nowLi) {
            this.nowLi = this.nowLi + this.startLi;
            this.startLi = this.nowLi - this.startLi;
            this.nowLi = this.nowLi - this.startLi;
        }
        if (this.startCo > this.nowCo) {
            this.nowCo = this.nowCo + this.startCo;
            this.startCo = this.nowCo - this.startCo;
            this.nowCo = this.nowCo - this.startCo;
        }
        if (this.startLi < 2) this.startLi = 2;
        if (this.startCo < 2) this.startCo = 2;
        if (this.nowLi > 115) this.nowLi = 115;
        if (this.nowCo > 115) this.nowCo = 115;
        let targetColor = this.id === "deletion-block" ? "red" : "blue";
        for (let i = this.startLi; i <= this.nowLi; i++) {
            for (let j = this.startCo; j <= this.nowCo; j++) {
                if (!$cell[i][j].isInRange) continue;
                let building = $cell[i][j].occupied;
                if (building && building.isFixed) continue;
                if (building && $$(building.id).className.indexOf(`selected-${targetColor}`) === -1) {
                    $$(building.id).className += ` selected-${targetColor}`;
                    this.cache.push(building.id);
                }
            }
        }
        if (!this.cache.length) {
            $$(this.id).style.display = "none";
            return;
        }
        $$(this.id).style.top = `${(this.startLi - 1) * $cellSize}px`;
        $$(this.id).style.left = `${(this.startCo - 1) * $cellSize}px`;
        $$(this.id).style.width = `${(this.nowCo - this.startCo + 1) * $cellSize}px`;
        $$(this.id).style.height = `${(this.nowLi - this.startLi + 1) * $cellSize}px`;
        $$(this.id).style.display = "block";
    }
}
