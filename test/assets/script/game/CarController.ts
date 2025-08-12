import {_decorator, Component} from 'cc';
import CarMover from './CarMover';

const {ccclass, property} = _decorator;

@ccclass('CarController')
export default class CarController extends Component {
    @property(CarMover) private mover!: CarMover;
}
