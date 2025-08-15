import {_decorator, Label, Component} from 'cc';
import GlobalEventTarget from '../../core/GlobalEventTarget';
import GameEvent from '../../enum/GameEvent';

const {ccclass, property} = _decorator;

@ccclass('CoinCounter')
export default class CoinCounter extends Component {
    @property(Label) private label!: Label;

    private currentCount: number = 0;

    protected onEnable(): void {
        GlobalEventTarget.on(GameEvent[GameEvent.COIN_ADDED], this.onCoinAdded, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(GameEvent[GameEvent.COIN_ADDED], this.onCoinAdded, this);
    }

    protected start(): void {
        this.setLabel();
    }

    private setLabel(): void {
        this.label.string = this.currentCount.toString();
    }

    private onCoinAdded(): void {
        this.currentCount++;

        this.setLabel();
    }
}
