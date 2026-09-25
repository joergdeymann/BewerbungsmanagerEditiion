import { HtmlUtils } from "../../utils/HtmlUtils.js";

export class CompanyImageList {

    constructor(container) {
        this.container = container;
        this.images = [];
        this.mainImageIndex = 0;
    }

    setImages(images, mainImageIndex = 0) {
        this.images = [...images];
        this.mainImageIndex = mainImageIndex;
        this.render();
    }

    getImages() {
        return this.images;
    }

    getMainImageIndex() {
        return this.mainImageIndex;
    }

    render() {
        this.container.innerHTML = `
            <p class="muted">Stern anklicken, um das Bild zum Hauptbild zu machen.</p>
            <div class="image-url-list">
                ${this.images.map((url, index) => this.row(url, index)).join("")}
            </div>
            <button type="button" class="secondary add-company-image">+ Bild hinzufügen</button>
        `;

        this.container.querySelectorAll("[data-select-main]").forEach(row => {
            row.onclick = event => {
                if (event.target.closest("input, button")) return;
                this.mainImageIndex = Number(row.dataset.selectMain);
                this.render();
            };
        });

        this.container.querySelectorAll("[data-image-url]").forEach(input => {
            input.oninput = () => {
                this.images[Number(input.dataset.imageUrl)] = input.value.trim();
            };
        });

        this.container.querySelectorAll("[data-remove-image]").forEach(button => {
            button.onclick = () => {
                const index = Number(button.dataset.removeImage);
                this.images.splice(index, 1);
                if (this.mainImageIndex >= this.images.length) this.mainImageIndex = 0;
                this.render();
            };
        });

        this.container.querySelector(".add-company-image").onclick = () => {
            this.images.push("");
            this.render();
        };
    }

    row(url, index) {
        const isMain = index === this.mainImageIndex;

        return `
            <div class="field-with-button image-url-row${isMain ? " image-url-row-main" : ""}" data-select-main="${index}">
                ${isMain
                    ? `<span class="tag-badge skill-expert">★ Hauptbild</span>`
                    : `<span class="image-main-hint" title="Klicken, um zum Hauptbild zu machen">☆</span>`}
                <div class="field"><input type="url" data-image-url="${index}" value="${HtmlUtils.escape(url)}" placeholder="https://..."></div>
                <button type="button" class="icon-button" data-remove-image="${index}">×</button>
            </div>
        `;
    }
}