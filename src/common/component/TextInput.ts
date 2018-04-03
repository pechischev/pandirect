import Dispatcher from '../event/Dispatcher';
import TagName from '../dom/TagName';
import Component from './Component';

class TextInput extends Component {
    private _changedEvent: Dispatcher;
    private _blurEvent: Dispatcher;
    private _focusEvent: Dispatcher;

    constructor(placeholder?: string) {
        super({
            className: 'text-input',
            tagName: TagName.INPUT
        });

        this._changedEvent = new Dispatcher();
        this._blurEvent = new Dispatcher();
        this._focusEvent = new Dispatcher();

        this.listen('change', () => this._changedEvent.dispatch());
        this.listen('focus', () => this._blurEvent.dispatch());
        this.listen('blur', () => this._focusEvent.dispatch());

        if (placeholder)
        {
            this.setAttribute({name: 'placeholder', value: placeholder});
        }
    }

    setValue(value: string) {
        const element = this.displayObject();
        if (element instanceof HTMLInputElement) // TODO: to fix typing problem, temporary solution
        {
            element.value = value;
        }
    }

    value() {
        const element = this.displayObject();
        if (element instanceof HTMLInputElement) // TODO: to fix typing problem, temporary solution
        {
            return element.value;
        }
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

export default TextInput;