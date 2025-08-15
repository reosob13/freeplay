import {_decorator, Component, ICollisionEvent, RigidBody, Animation, BoxCollider} from 'cc';
import CarMover from './CarMover';
import CarElement from './CarElement';
import GameEvent from '../enum/GameEvent';
import GlobalEventTarget from '../core/GlobalEventTarget';
import ActionZone from './ActionZone';
import ZoneType from '../enum/ZoneType';

const {ccclass, property} = _decorator;

@ccclass('CarController')
export default class CarController extends Component {
    @property(CarMover) private mover!: CarMover;
    @property(RigidBody) private rb!: RigidBody;
    @property(BoxCollider) private collider!: BoxCollider;
    @property(Animation) private animation!: Animation;
    @property([CarElement]) private elements: CarElement[] = [];

    private isFallen: boolean = false;

    protected onEnable(): void {
        GlobalEventTarget.on(GameEvent[GameEvent.LEVER_CHANGED], this.onLeverChanged, this);
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    protected onDisable(): void {
        GlobalEventTarget.off(GameEvent[GameEvent.LEVER_CHANGED], this.onLeverChanged, this);
        this.collider.off('onTriggerEnter', this.onTriggerEnter, this);
    }

    private fall(): void {
        if (this.isFallen) {
            return;
        }

        this.isFallen = true;

        this.mover.stop();
        this.mover.enabled = false;

        this.animation.stop();

        this.rb.sleep();

        GlobalEventTarget.emit(GameEvent[GameEvent.FAIL]);

        for (const element of this.elements) {
            element.fall();
        }
    }

    private onLeverChanged(leverValue: number): void {
        if (this.isFallen) {
            return;
        }

        this.mover.getLeverValue(leverValue);

        const clip = this.animation.defaultClip;
        const state = this.animation.getState(clip.name);

        state.speed = leverValue;
        this.animation.play(clip.name);
    }


    private onTriggerEnter(event: ICollisionEvent): void {
        const failZone = event.otherCollider.getComponent(ActionZone);

        if (!failZone) {
            return;
        }

        switch (failZone.typeValue) {
            case ZoneType.Fail:
                this.fall();
                break;

            case ZoneType.Fall:
                GlobalEventTarget.emit(GameEvent[GameEvent.TOUCHED_FALL_ZONE]);
                break;
        }
    }
}
