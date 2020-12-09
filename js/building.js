class Building {
    constructor(config) {
        this.line = config.line;
        this.column = config.column;
        this.width = config.width;
        this.height = config.height;
        this.text = config.text;
        this.color = config.color;
        this.background = config.background;
        this.borderColor = config.borderColor;
        this.borderWidth = config.borderWidth;
        this.range = config.range || 0;
        this.id = config.id || getBuildingID(config);
        this.borderTop = config.borderTop || true;
        this.borderRight = config.borderRight || true;
        this.borderBottom = config.borderBottom || true;
        this.borderLeft = config.borderLeft || true;
        this.isMiracel = config.isMiracel || false;
        this.isFixed = config.isFixed || false;
        this.isProtection = config.isProtection || false;
        this.barrierType = config.barrierType || "";
        this.isRoad = config.isRoad || false;
        this.special = config.special || "";
        this.marker = config.marker || 0;
    }

    init() {
        let node = document.createElement("div");
        let text = document.createElement("div");
        let marker = document.createElement("span");
        node.style.top = `${(this.line - 1) * $cellSize}px`;
        node.style.left = `${(this.column - 1) * $cellSize}px`;
        node.style.width = `${this.width * $cellSize}px`;
        node.style.height = `${this.height * $cellSize}px`;
        node.style.color = this.color;
        node.style.background = this.background;
        node.style.borderColor = this.borderColor;
        node.style.borderWidth = `${this.borderWidth}px`;
        node.style.borderStyle = this.getBorderStyle();
        node.id = this.id;
        node.className = "building";
        if ((!this.isFixed || this.text) && !this.isRoad) node.className += " hoverable";
        // if (this.isProtection && $config.showEffect) node.className += " protection-mask";
        text.innerHTML = this.text;
        text.className = "text";
        marker.innerHTML = this.marker;
        marker.className = "marker";
        if (!this.showMarker()) marker.style.display = "none";
        if (this.range) {
            node.onmouseover = this.onMouseEnter;
            node.onmouseleave = this.onMouseLeave;
        }
        node.append(text, marker);
        $$("building").appendChild(node);
    }

    getBorderStyle() {
        let style = "";
        style += this.borderTop ? "solid " : "none ";
        style += this.borderRight ? "solid " : "none ";
        style += this.borderBottom ? "solid " : "none ";
        style += this.borderLeft ? "solid " : "none ";
        return style;
    }

    showMarker() {
        if (this.marker === 0) return false;
        if (this.barrierType) return false;
        if (this.isProtection) return false;
        if (this.isMiracel) return false;
        return true;
    }

    updateBorderStyle() {
        $$(this.id).style.borderStyle = this.getBorderStyle();
    }

    onMouseEnter() {
        let unit = parseID(this.id);
        let building = $cell[unit[0]][unit[1]].occupied;
        $range.show(building);
    }

    onMouseLeave() {
        $range.hide(this.id);
    }
}
