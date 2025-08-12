import {_decorator, Component, Vec3} from 'cc';

const {ccclass} = _decorator;

@ccclass('PooledComponent')
export abstract class PooledComponent extends Component {
    public get isFree(): boolean {
        return !this.node.active;
    }

    public spawnFromPool(): void {
        this.node.active = true;
    }

    public returnToPool(): void {
        this.node.active = false;
        this.node.angle = 0;
        this.node.setPosition(Vec3.ZERO);
        this.node.setParent(null);
    }
}