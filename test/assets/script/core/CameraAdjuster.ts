import {_decorator, Component, Camera, Vec3, CCFloat} from 'cc';
import PlayableEvent from '../enum/PlayableEvent';
import ScreenInfo from './ScreenInfo';
import GlobalEventTarget from './GlobalEventTarget';

const {ccclass, property, menu} = _decorator;

@ccclass('CameraPos')
export class CameraPos {
    @property(Vec3) public cameraPortraitPos: Vec3 = new Vec3();
    @property(Vec3) public cameraLandscapePos: Vec3 = new Vec3();
}

@ccclass('CameraAngle')
export class CameraAngle {
    @property(Vec3) public cameraPortraitAngle: Vec3 = new Vec3();
    @property(Vec3) public cameraLandscapeAngle: Vec3 = new Vec3();
}

@ccclass('CameraFov')
export class CameraFov {
    @property(CCFloat) public portraitFov: number = 6.3;
    @property(CCFloat) public landscapeFov: number = 4;
}

@ccclass('CameraAdjuster')
@menu('Camera/CameraAdjuster')
export default class CameraAdjuster extends Component {
    @property(CameraPos) private cameraPos: CameraPos = new CameraPos();
    @property(CameraAngle) private cameraAngle: CameraAngle = new CameraAngle();
    @property(CameraFov) private cameraFov: CameraFov = new CameraFov();

    private camera: Camera | null = null;

    protected onLoad(): void {
        this.camera = this.node.getComponent(Camera);
    }

    protected onEnable(): void {
        GlobalEventTarget.on(PlayableEvent[PlayableEvent.WINDOW_RESIZED], this.onWindowResized, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(PlayableEvent[PlayableEvent.WINDOW_RESIZED], this.onWindowResized, this);
    }

    private onWindowResized(screenInfo: ScreenInfo): void {
        this.camera.fov = screenInfo.isLandscape ? this.cameraFov.landscapeFov : this.cameraFov.portraitFov;
        this.node.position = screenInfo.isLandscape ? this.cameraPos.cameraLandscapePos : this.cameraPos.cameraPortraitPos;
        this.node.eulerAngles = screenInfo.isLandscape ? this.cameraAngle.cameraLandscapeAngle : this.cameraAngle.cameraPortraitAngle;
    }
}