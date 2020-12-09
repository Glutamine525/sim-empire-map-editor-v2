class Building {
    constructor(bConfig) {
        this.line = bConfig.line;
        this.column = bConfig.column;
        this.width = bConfig.width;
        this.height = bConfig.height;
        this.range = bConfig.range;
        this.text = bConfig.text;
        this.color = bConfig.color;
        this.background = bConfig.background;
        this.borderColor = bConfig.borderColor;
        this.borderWidth = bConfig.borderWidth;
        this.id = bConfig.id || getBuildingID(bConfig);
        this.borderTop = bConfig.borderTop || true;
        this.borderRight = bConfig.borderRight || true;
        this.borderBottom = bConfig.borderBottom || true;
        this.borderLeft = bConfig.borderLeft || true;
        this.isMiracel = bConfig.isMiracel || false;
        this.isFixed = bConfig.isFixed || false;
        this.isProtection = bConfig.isProtection || false;
        this.barrierType = bConfig.barrierType || "";
        this.isRoad = bConfig.isRoad || false;
        this.special = bConfig.special || "";
        this.isPreview = bConfig.isPreview || false;
        this.marker = bConfig.marker || 0;
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
        if ((!this.isFixed || this.text) && !this.isPreview && !this.isRoad) node.className += " hoverable";
        text.innerHTML = this.text;
        text.className = "text";
        marker.innerHTML = this.marker;
        marker.className = "marker";
        if (!this.showMarker()) marker.style.display = "none";
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
}
