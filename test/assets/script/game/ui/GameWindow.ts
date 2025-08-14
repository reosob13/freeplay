import {_decorator, Component, Animation} from 'cc';
import GameEvent from '../../enum/GameEvent';
import GlobalEventTarget from '../../core/GlobalEventTarget';

const {ccclass, property} = _decorator;

@ccclass('GameWindow')
export default class GameWindow extends Component {
    @property(Animation) private animation!: Animation;

    protected onEnable(): void {
        GlobalEventTarget.on(GameEvent[GameEvent.FAIL], this.onFail, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(GameEvent[GameEvent.FAIL], this.onFail, this);
    }

    private hide(): void {
        this.animation.play();
    }

    private onFail(): void {
        this.hide();
    }
}
