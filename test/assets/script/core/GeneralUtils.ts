import {Animation} from 'cc';

export default class GeneralUtils {
    public static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static playAnimation(animation: Animation, name: string = ''): Promise<void> {
        if (name === '') {
            name = animation.defaultClip.name;
        }

        return new Promise(resolve => {
            animation.play(name);
            animation.once(Animation.EventType.FINISHED, resolve);
        });
    }
}
