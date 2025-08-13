import {_decorator, Component, Collider, ICollisionEvent, RigidBody} from 'cc';
import CarMover from './CarMover';
import Log from './Log';

const {ccclass, property} = _decorator;

@ccclass('CarController')
export default class CarController extends Component {
    @property(CarMover) private mover!: CarMover;
    @property(RigidBody) private rb!: RigidBody;
    @property(Collider) private collider!: Collider;

    private logsInContact: Log[] = []; // Массив для хранения бревен в контакте

    protected onEnable(): void {
        this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
        this.collider.on('onCollisionExit', this.onCollisionExit, this);
    }

    protected onDisable(): void {
        this.collider.off('onCollisionEnter', this.onCollisionEnter, this);
        this.collider.off('onCollisionExit', this.onCollisionExit, this);
    }

    private onCollisionEnter(e: ICollisionEvent): void {
        const logComponent = e.otherCollider.node.getComponent(Log);
        if (logComponent) {
            // Проверяем наличие бревна в массиве через findIndex
            const alreadyExists = this.logsInContact.findIndex(log => log === logComponent) !== -1;
            if (!alreadyExists) {
                this.logsInContact.push(logComponent);
                console.log(`Бревно добавлено. Всего бревен: ${this.logsInContact.length}`);
            }
        }
    }

    private onCollisionExit(e: ICollisionEvent): void {
        const logComponent = e.otherCollider.node.getComponent(Log);
        if (logComponent) {
            // Удаляем бревно из массива
            const index = this.logsInContact.findIndex(log => log === logComponent);
            if (index !== -1) {
                this.logsInContact.splice(index, 1);
                console.log(`Бревно удалено. Осталось бревен: ${this.logsInContact.length}`);

                // Проверяем, если массив пуст
                if (this.logsInContact.length === 0) {
                    console.log("Test");
                }
            }
        }
    }
}