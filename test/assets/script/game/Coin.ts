import {_decorator, Collider, ICollisionEvent, tween} from 'cc';
import {PooledComponent} from '../core/Pool/PooledComponent';
import CarController from './CarController';
import MoneyCounter from './ui/MoneyCounter';
import GeneralUtils from '../core/GeneralUtils';
import GlobalEventTarget from '../core/GlobalEventTarget';
import GameEvent from '../enum/GameEvent';

const {ccclass, property} = _decorator;

@ccclass('Coin')
export default class Coin extends PooledComponent {
    @property(Collider) private collider!: Collider;

    protected onEnable(): void {
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    protected onDisable(): void {
        this.collider.off('onTriggerEnter', this.onTriggerEnter, this);
    }

    public disable(): void {
        this.returnToPool();
    }

    private onTriggerEnter(event: ICollisionEvent): void {
        const car = event.otherCollider.getComponent(CarController);

        if (!car) {
            return;
        }

        GlobalEventTarget.emit(GameEvent[GameEvent.COIN_ADDED]);

        this.disable();
    }
}
