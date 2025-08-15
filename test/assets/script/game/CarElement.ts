import {_decorator, Component, ERigidBodyType, RigidBody} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('CarElement')
export default class CarElement extends Component {
    @property(RigidBody) private rb!: RigidBody;

    public fall(): void {
        this.rb.type = ERigidBodyType.DYNAMIC;
    }
}
