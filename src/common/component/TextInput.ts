import { Component } from "common/component/Component";
import { TagName } from "common/dom/TagName";
import { Dispatcher } from "common/event/Dispatcher";

export class TextInput extends Component<HTMLInputElement> {
	private _changedEvent: Dispatcher;
	private _blurEvent: Dispatcher;
	private _focusEvent: Dispatcher;

	constructor(placeholder?: string) {
		super({
			className: "text-input",
			tagName: TagName.INPUT
		});

		this._changedEvent = new Dispatcher();
		this._blurEvent = new Dispatcher();
		this._focusEvent = new Dispatcher();

		this.listen("change", () => this._changedEvent.dispatch());
		this.listen("blur", () => this._blurEvent.dispatch());
		this.listen("focus", (event: Event) => {
			this._focusEvent.dispatch();
		});

		if (placeholder) {
			this.setAttribute({name: "placeholder", value: placeholder});
		}
	}

	setValue(value: string) {
		const element = this.element();
		element.value = value;
	}

	value() {
		const element = this.element();
		return element.value;
	}

	changedEvent(): Dispatcher {
		return this._changedEvent;
	}

	blurEvent(): Dispatcher {
		return this._blurEvent;
	}

	focusEvent(): Dispatcher {
		return this._focusEvent;
	}
}
