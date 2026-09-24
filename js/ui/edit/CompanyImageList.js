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
            <div class="image-url-list">
                ${this.images.map((url, index) => this.row(url, index)).join("")}
            </div>
            <button type="button" class="secondary add-company-image">+ Bild hinzufügen</button>
        `;

        this.container.querySelectorAll("[data-main-index]").forEach(radio => {
            radio.onchange = () => {
                this.mainImageIndex = Number(radio.dataset.mainIndex);
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
        return `
            <div class="field-with-button image-url-row">
                <label class="image-main-select">
                    <input type="radio" name="companyMainImage" data-main-index="${index}" ${index === this.mainImageIndex ? "checked" : ""}>
                    Hauptbild
                </label>
                <input type="url" class="image-url-input" data-image-url="${index}" value="${HtmlUtils.escape(url)}" placeholder="https://...">
                <button type="button" class="icon-button" data-remove-image="${index}">×</button>
            </div>
        `;
    }
}