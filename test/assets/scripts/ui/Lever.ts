import {_decorator, Component} from 'cc';
import InputSystem from '../core/Input/InputSystem';

const {ccclass, property} = _decorator;

@ccclass('Lever')
export default class Lever extends Component {
    private inputSystem: InputSystem;

    protected onLoad(): void {
        this.inputSystem = InputSystem.getInstance<InputSystem>();
    }

    protected onEnable(): void {

    }

    protected onDisable(): void {

    }
}
