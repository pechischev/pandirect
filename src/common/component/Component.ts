import { TagName } from "common/dom/TagName";
import { BemInfo } from "./BemInfo";
import { Disposable } from "./Disposable";

interface IComponentConfig {
	blockName?: string;
	tagName?: TagName;
	element?: HTMLElement;
	content?: string;
}

export class Component extends Disposable {
	private _element: HTMLElement ;
	private _bemInfo: BemInfo[] = [];

	constructor(config?: IComponentConfig) {
		super();
		const {blockName, tagName, element, content} = config;
		this.initBaseElement(tagName, element);
		if (blockName) {
			this._bemInfo.push(new BemInfo(config.blockName));
		}
		if (content) {
			this._element.innerHTML = config.content;
		}
		this.invalidateClassName();
	}

	addChild(child: Component | Node) {
		const node = (child instanceof Component) ? child.element() : child;
		this._element.appendChild(node);
	}

	removeChild(child: Component | Node) {
		const node = (child instanceof Component) ? child.element() : child;
		if (this._element.contains(node)) {
			this._element.removeChild(node);
		}
	}

	removeChildren() {
		while (this._element.firstChild) {
			this.removeChild(this._element.firstChild);
		}
	}

	element(): HTMLElement {
		return this._element;
	}

	setPosition(x: number, y: number) {
		this.setStyle("left", `${x}px`);
		this.setStyle("top", `${y}px`);
	}

	x(): number {
		return this._element.offsetLeft;
	}

	y(): number {
		return this._element.offsetTop;
	}

	setTextContent(text: string) {
		this._element.textContent = text;
	}

	textContent(): string {
		return this._element.textContent || "";
	}

	setWidth(width: number) {
		this.setStyle("width", `${width}px`);
	}

	setHeight(height: number) {
		this.setStyle("height", `${height}px`);
	}

	width(): number {
		return this._element.offsetWidth;
	}

	height(): number {
		return this._element.offsetHeight;
	}

	getClientRect(): ClientRect {
		return this._element.getBoundingClientRect();
	}

	applyStyles(stylesList: {[key: string]: string|number}) {
		for (const style in stylesList) {
			this.setStyle(style, stylesList[style]);
		}
	}

	setVisible(value: boolean) {
		this.setStyle("display", (value) ? "" : "none");
	}

	visible(): boolean {
		return this._element.style.getPropertyValue("display") != "none";
	}

	setStyle(style: string, value: string|number) {
		style = style.toLowerCase();
		const styles = [style];
		if (!this._element.style.hasOwnProperty(style)) {
			const styleName = style.substr(0, 1).toUpperCase() + style.substr(1, style.length);
			styles.push(...[
				`Webkit${styleName}`,
				`Moz${styleName}`,
				`ms${styleName}`,
				`O${styleName}`,
			]);
		}
		for (const style of styles) {
			this.setStyleImpl(style, value);
		}
	}

	setAttribute(attr: { name: string, value: string }) {
		this._element.setAttribute(attr.name, attr.value);
	}

	removeAttribute(name: string) {
		this._element.removeAttribute(name);
	}

	updateModifier(modifier: string, value: string|number|boolean) {
		this._bemInfo[0].updateModifier(modifier, value);
		this.invalidateClassName();
	}

	applyBemInfo(blockName: string | BemInfo, elementName?: string) { // TODO: rename
		const bemInfo = (blockName instanceof BemInfo) ? blockName : new BemInfo(blockName, elementName);
		this._bemInfo.push(bemInfo);
		this.invalidateClassName();
	}

	createChildBemInfo(elementName: string): BemInfo {
		return new BemInfo(this._bemInfo[0].blockName(), elementName);
	}

	private invalidateClassName() {
		let className = "";
		for (const bemInfo of this._bemInfo) {
			className += className ? ` ${bemInfo.getClassName()}` : bemInfo.getClassName();
		}
		this._element.setAttribute("class", className);
	}

	private initBaseElement(tagName: TagName = TagName.DIV, element?: HTMLElement) {
		if (element && tagName) {
			throw new Error("Undefined behavior: tagName and element is set");
		}
		if (element) {
			this._element = element;
		}
		if (tagName || !element) {
			this._element = document.createElement(tagName);
		}
	}

	private setStyleImpl(style: string, value: string|number) {
		this._element.style.setProperty(style, value.toString());
	}
}
