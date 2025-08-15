import {_decorator, Component, Vec3, view, director, Sprite, CCString, PhysicsSystem, } from 'cc';
import GlobalEventTarget from './GlobalEventTarget';
import PlayableEvent from '../enum/PlayableEvent';
import super_html_playable from './super_html_playable';
import ScreenInfo from './ScreenInfo';
import InputSource from './Input/InputSource';
import InputType from './Input/InputType';
import InputSystem from './Input/InputSystem';
import InputEventData from './Input/InputEventData';

const {ccclass, property} = _decorator;

@ccclass()
export default class PlayableController extends Component {
    @property(CCString) private androidUrl: string = '';
    @property(CCString) private iosUrl: string = '';

    @property(Sprite) private back!: Sprite;

    private screenInfo: ScreenInfo = new ScreenInfo();

    private inputSystem: InputSystem | null = null;

    protected onLoad(): void {
        this.setRedirectUrl();

        this.inputSystem = InputSystem.getInstance<InputSystem>();

        this.back.node.active = false;
    }

    protected onEnable(): void {
        this.inputSystem?.on(InputType[InputType.Down], this.onDown, this);
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.REDIRECT], this.onRedirect, this);
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.RESULT], this.onResult, this);

        view.setResizeCallback(() => {
            this.windowResized();
        });
    }

    protected onDisable(): void {
        this.inputSystem?.off(InputType[InputType.Down], this.onDown, this);
        GlobalEventTarget.off(PlayableEvent[PlayableEvent.REDIRECT], this.onRedirect, this);
        GlobalEventTarget.off(PlayableEvent[PlayableEvent.RESULT], this.onResult, this);
    }

    protected start(): void {
        this.windowResized();
    }

    private setRedirectUrl(): void {
        super_html_playable.set_google_play_url(this.androidUrl);
        super_html_playable.set_app_store_url(this.iosUrl);
    }

    private windowResized(): void {
        this.screenInfo.update();

        GlobalEventTarget.emit(PlayableEvent[PlayableEvent.WINDOW_RESIZED], this.screenInfo);
    }

    private onDown(data: InputEventData): void {
        if (data.touchSource === InputSource.RedirectButton) {
            GlobalEventTarget.emit(PlayableEvent[PlayableEvent.REDIRECT]);
        }
    }

    private onRedirect(): void {
        director.pause();
        super_html_playable.download();
        director.resume();

        this.back.node.active = true;
    }

    private onResult(): void {
        super_html_playable.game_end();

        this.back.node.active = true;
    }
}