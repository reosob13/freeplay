import {_decorator, Component, Vec3, view, director, Sprite, } from 'cc';
import {PhysicsSystem} from 'cc';
import GlobalEventTarget from './GlobalEventTarget';
import PlayableEvent from '../enum/PlayableEvent';
import super_html_playable from './super_html_playable';
import ScreenInfo from './ScreenInfo';
import AudioSystem from './Audio/AudioSystem';
import AudioName from './Audio/AudioName';
import InputSource from './Input/InputSource';
import InputType from './Input/InputType';
import InputSystem from './Input/InputSystem';

const {ccclass, property} = _decorator;

@ccclass()
export default class PlayableController extends Component {
    @property private androidUrl: string = '';
    @property private iosUrl: string = '';

    @property(Sprite) private back!: Sprite;

    private screenInfo: ScreenInfo = new ScreenInfo();

    private mainSoundId: number = -1;

    private audioSystem: AudioSystem | null = null;
    private inputSystem: InputSystem | null = null;

    protected onLoad(): void {
        this.setRedirectUrl();

        this.audioSystem = AudioSystem.getInstance<AudioSystem>();
        this.inputSystem = InputSystem.getInstance<InputSystem>();

        this.subscribePlayableEvents();
    }

    protected start(): void {
        this.windowResized();
    }

    private setRedirectUrl(): void {
        super_html_playable.set_google_play_url(this.androidUrl);
        super_html_playable.set_app_store_url(this.iosUrl);
    }

    private subscribePlayableEvents(): void {
        view.setResizeCallback(() => {
            this.windowResized();
        });

        this.inputSystem?.on(InputType[InputType.Down], this.onDown, this);
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.REDIRECT], this.onRedirect, this);
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.RESULT], this.onResult, this);
    }

    private windowResized(): void {
        this.screenInfo.update();

        GlobalEventTarget.emit(PlayableEvent[PlayableEvent.WINDOW_RESIZED], this.screenInfo);
    }

    private onResult(): void {
        this.audioSystem.stop(this.mainSoundId);

        super_html_playable.game_end();
        GlobalEventTarget.emit(PlayableEvent[PlayableEvent.RESULT_SHOW]);

        this.back.node.active = true;
    }

    private onDown(source: InputSource): void {
        if (this.mainSoundId === -1) {
            this.mainSoundId = this.audioSystem.play(AudioName.Main) ?? -1;
        }

        if (source === InputSource.RedirectButton) {
            GlobalEventTarget.emit(PlayableEvent[PlayableEvent.REDIRECT]);
        }
    }

    private onRedirect(): void {
        director.pause();
        super_html_playable.download();
        director.resume();

        this.back.node.active = true;
    }
}