import {_decorator, CCFloat, Component, ERigidBodyType, RigidBody, Vec3} from 'cc';
import GeneralUtils from '../core/GeneralUtils';

const {ccclass, property} = _decorator;

@ccclass('CarElement')
export default class CarElement extends Component {
    @property(RigidBody) private rb!: RigidBody;

    public fall(): void {
        this.rb.type = ERigidBodyType.DYNAMIC;
    }
}
