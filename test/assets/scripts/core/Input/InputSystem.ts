import {_decorator, EventTouch, EventTarget, Sprite, } from 'cc';
import InputType from './InputType';
import Singleton from '../Singleton';
import InputSource from './InputSource';
import GlobalEventTarget from '../GlobalEventTarget';
import PlayableEvent from '../../enum/PlayableEvent';

const {ccclass, property} = _decorator;

@ccclass()
export default class InputSystem extends Singleton<InputSystem> {
    @property(Sprite) private back!: Sprite;

    private currentTouchID: number = 0;

    private isFirstTap: boolean = false;
    private isLockedMultiTouch: boolean = false;

    private readonly eventTarget: EventTarget = new EventTarget();

    protected onLoad(): void {
        super.onLoad();
        this.subscribePlayableEvent();
    }

    public on(key: string, callback: (...args: any[]) => void, target?: any, useCapture?: boolean): void {
        this.eventTarget.on(String(key), callback, target, useCapture);
    }

    public off(key: string, callback: (...args: any[]) => void, target?: any): void {
        this.eventTarget.off(String(key), callback, target);
    }

    private subscribePlayableEvent(): void {
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.INPUT], this.onInput, this);
    }

    private onInput(type: InputType, eventTouch: EventTouch, touchSource: InputSource): void {
        if (type === InputType.Down && !this.isFirstTap) {
            this.isFirstTap = true;
            this.back.node.active = false;

            GlobalEventTarget.emit(PlayableEvent[PlayableEvent.FIRST_TAP]);
        }

        if (this.isLockedMultiTouch && this.currentTouchID !== 0 && this.currentTouchID !== eventTouch.getID()) {
            return;
        }

        if (type === InputType.Up) {
            this.currentTouchID = 0;
        }

        if (type === InputType.Down) {
            this.currentTouchID = eventTouch.getID();
        }

        this.eventTarget.emit(InputType[InputType.None], {type, eventTouch, touchSource});
        this.eventTarget.emit(InputType[type], {type, eventTouch, touchSource});
    }
}