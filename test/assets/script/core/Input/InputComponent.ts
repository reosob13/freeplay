import {_decorator, Component, Enum, EventTouch, Node, } from 'cc';
import InputSource from './InputSource';
import GlobalEventTarget from '../GlobalEventTarget';
import PlayableEvent from '../../enum/PlayableEvent';
import InputType from './InputType';

const {ccclass, property, menu} = _decorator;

@ccclass()
@menu('Input/InputComponent')
export default class InputComponent extends Component {
    @property({type: Enum(InputSource)}) private inputSource: InputSource = InputSource.Default;

    public get inputSourceValue(): InputSource {
        return this.inputSource;
    }

    protected onEnable(): void {
        this.toggleSubscribe(true);
    }

    protected onDisable(): void {
        this.toggleSubscribe(false);
    }

    private toggleSubscribe(isOn: boolean): void {
        const op = isOn ? 'on' : 'off';

        this.node[op](Node.EventType.TOUCH_START, this.onDown, this);
        this.node[op](Node.EventType.TOUCH_END, this.onUp, this);
        this.node[op](Node.EventType.TOUCH_CANCEL, this.onUp, this);
        this.node[op](Node.EventType.TOUCH_MOVE, this.onMove, this);
    }

    private onDown(eventTouch: EventTouch): void {
        GlobalEventTarget.emit(PlayableEvent[PlayableEvent.INPUT], InputType.Down, eventTouch, this.inputSource);
    }

    private onUp(eventTouch: EventTouch): void {
        GlobalEventTarget.emit(PlayableEvent[PlayableEvent.INPUT], InputType.Up, eventTouch, this.inputSource);
    }

    private onMove(eventTouch: EventTouch): void {
        GlobalEventTarget.emit(PlayableEvent[PlayableEvent.INPUT], InputType.Drag, eventTouch, this.inputSource);
    }
}