import {_decorator, Component, Vec2} from 'cc';
import ScreenInfo from './ScreenInfo';
import GlobalEventTarget from './GlobalEventTarget';
import PlayableEvent from '../enum/PlayableEvent';

const {ccclass, property, menu} = _decorator;

@ccclass('RectTransformConfig')
export class RectTransformConfig {
    @property(Vec2) position: Vec2 = new Vec2(0, 0);
    @property(Vec2) scale: Vec2 = new Vec2(1, 1);
}

@ccclass('RectTransform')
@menu('Transform/RectTransform')
export default class RectTransform extends Component {
    @property({
        displayName: 'Landscape',
        type: RectTransformConfig
    }) private landscape: RectTransformConfig = new RectTransformConfig();
    @property({
        displayName: 'Portrait',
        type: RectTransformConfig
    }) private portrait: RectTransformConfig = new RectTransformConfig();

    private screenInfo: ScreenInfo = new ScreenInfo();

    protected onEnable(): void {
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.WINDOW_RESIZED], this.onResize, this);
        this.apply();
    }

    protected onDisable(): void {
        GlobalEventTarget.off(PlayableEvent[PlayableEvent.WINDOW_RESIZED], this.onResize, this);
    }

    private onResize(): void {
        this.apply();
    }

    private apply(): void {
        this.screenInfo.update();

        const cfg = this.screenInfo.isLandscape ? this.landscape : this.portrait;

        const refW = this.screenInfo.gameWidth;
        const refH = this.screenInfo.gameHeight;

        const x = cfg.position.x * refW;
        const y = cfg.position.y * refH;

        this.node.setPosition(x, y, this.node.position.z);
        this.node.setScale(cfg.scale.x, cfg.scale.y, this.node.scale.z);
    }
}
