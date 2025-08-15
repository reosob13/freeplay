import {_decorator, CCFloat, Component, Animation} from 'cc';
import GeneralUtils from '../../core/GeneralUtils';
import GameEvent from '../../enum/GameEvent';
import GlobalEventTarget from '../../core/GlobalEventTarget';

const {ccclass, property} = _decorator;

export enum TutorAnimName {
    Show = 'tutor_show',
    Play = 'tutor_play',
    Hide = 'tutor_hide',
}

@ccclass('TutorHand')
export default class TutorHand extends Component {
    @property(CCFloat) private timeInactivity: number = 1;

    @property(Animation) private animation!: Animation;

    private isTutorialFinished: boolean = false;

    protected onEnable(): void {
        GlobalEventTarget.on(GameEvent[GameEvent.LEVER_CHANGED], this.onLeverChanged, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(GameEvent[GameEvent.LEVER_CHANGED], this.onLeverChanged, this);
    }

    protected async start(): Promise<void> {
        await this.playTutor();
    }

    private async playTutor(): Promise<void> {
        if (this.isTutorialFinished) {
            return;
        }

        await this.playAnimationSafe(TutorAnimName.Show);
        await this.playAnimationSafe(TutorAnimName.Play);
        await this.playAnimationSafe(TutorAnimName.Hide);

        this.scheduleOnce(() => this.playTutor(), this.timeInactivity);
    }

    private async playAnimationSafe(animName: TutorAnimName): Promise<void> {
        if (this.isTutorialFinished) {
            return;
        }

        await GeneralUtils.playAnimation(this.animation, animName);
    }

    private onLeverChanged(leverValue: number): void {
        if (this.isTutorialFinished || leverValue <= 0) {
            return;
        }

        this.isTutorialFinished = true;

        this.unscheduleAllCallbacks();

        this.animation.stop();

        this.animation.play(TutorAnimName.Hide);
    }
}