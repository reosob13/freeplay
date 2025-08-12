import {_decorator, EventTouch, EventTarget, Sprite, } from 'cc';
import InputType from './InputType';
import Singleton from '../Singleton';
import InputSource from './InputSource';
import GlobalEventTarget from '../GlobalEventTarget';
import PlayableEvent from '../../enum/PlayableEvent';

const {ccclass, property} = _decorator;

@ccclass()
export default class InputSystem extends Singleton<InputSystem> {
    private currentTouchID: number | null = 0;

    private isFirstTap: boolean = false;
    private isLockedMultiTouch: boolean = false;

    protected onLoad(): void {
        super.onLoad();
        this.subscribePlayableEvent();
    }

    public on(key: number | string, callback: (...args: any[]) => void, target?: any): void {
        GlobalEventTarget.on(String(key), callback, target);
    }

    public off(key: number | string, callback: (...args: any[]) => void, target?: any): void {
        GlobalEventTarget.off(String(key), callback, target);
    }

    private subscribePlayableEvent(): void {
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.INPUT], this.onInput, this);
    }

    private onInput(type: InputType, eventTouch: EventTouch, touchSource: InputSource): void {
        if (type === InputType.Down && !this.isFirstTap) {
            this.isFirstTap = true;

            GlobalEventTarget.emit(PlayableEvent[PlayableEvent.FIRST_TAP]);
        }

        if (this.isLockedMultiTouch && this.currentTouchID !== null && this.currentTouchID !== eventTouch.getID()) {
            return;
        }

        if (type === InputType.Up) {
            this.currentTouchID = null;
        }

        if (type === InputType.Down) {
            this.currentTouchID = eventTouch.getID();
        }

        GlobalEventTarget.emit(InputType.None.toString(), {touchSource});
        GlobalEventTarget.emit(type.toString(), {touchSource});
    }
}