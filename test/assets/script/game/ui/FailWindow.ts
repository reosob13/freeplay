import {_decorator, Animation, CCFloat, Component} from 'cc';
import InputComponent from '../../core/Input/InputComponent';
import GlobalEventTarget from '../../core/GlobalEventTarget';
import GameEvent from '../../enum/GameEvent';

const {ccclass, property} = _decorator;

@ccclass('FailWindow')
export default class FailWindow extends Component {
    @property(InputComponent) private redirectInput!: InputComponent;
    @property(Animation) private animation!: Animation;
    @property(Animation) private buttonAnimation!: Animation;
    @property(CCFloat) private bounceTime: number = 4;

    protected onLoad(): void {
        this.redirectInput.enabled = false;
    }

    protected onEnable(): void {
        GlobalEventTarget.on(GameEvent[GameEvent.FAIL], this.onFail, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(GameEvent[GameEvent.FAIL], this.onFail, this);
    }

    private show(): void {
        this.redirectInput.enabled = true;
        this.animation.play();

        this.schedule(() => {
            this.buttonAnimation.play();
        }, this.bounceTime)
    }

    private onFail(): void {
        this.show();
    }
}
