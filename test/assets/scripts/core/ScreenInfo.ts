import {_decorator, Vec2, view} from 'cc';

const {ccclass} = _decorator;

@ccclass('ScreenInfo')
export default class ScreenInfo {
    private gameWidthValue: number = 0;
    private gameHeightValue: number = 0;
    private isLandscapeValue: boolean = false;

    public get gameWidth(): number {
        return this.gameWidthValue;
    }

    public get gameHeight(): number {
        return this.gameHeightValue;
    }

    public get isLandscape(): boolean {
        return this.isLandscapeValue;
    }

    public update(): void {
        const frameSize = view.getFrameSize();

        this.gameWidthValue = frameSize.width;
        this.gameHeightValue = frameSize.height;

        this.isLandscapeValue = this.gameWidthValue > this.gameHeightValue;
    }
}