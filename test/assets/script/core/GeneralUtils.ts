import {Vec2, Vec3, Node, Component, Animation, SkeletalAnimation, Mat4, EventTouch} from 'cc';

export default class GeneralUtils {
    public static pickRandom<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
    }

    public static reparentKeepPosition(node: Node, newParent: Node): void {
        const worldPos = node.worldPosition.clone();
        node.parent = newParent;
        node.setWorldPosition(worldPos);
    }

    public static randomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static randomVec2(min: Vec2, max: Vec2): Vec2 {
        return new Vec2(this.randomFloat(min.x, max.x), this.randomFloat(min.y, max.y));
    }

    public static randomVec3(min: Vec3, max: Vec3): Vec3 {
        return new Vec3(this.randomFloat(min.x, max.x), this.randomFloat(min.y, max.y), this.randomFloat(min.z, max.z));
    }

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    public static traverseChildren(node: Node, callback: (n: Node) => void): void {
        node.children.forEach(child => {
            callback(child);
            this.traverseChildren(child, callback);
        });
    }

    public static wait(component: Component, seconds: number): Promise<void> {
        return new Promise(resolve => {
            component.scheduleOnce(resolve, seconds);
        });
    }

    public static playAnimation(name: string, animation: Animation): Promise<void> {
        return new Promise(resolve => {
            animation.play(name);
            animation.once(Animation.EventType.FINISHED, resolve);
        });
    }

    public static playSkeletalAnimation(name: string, skeleton: SkeletalAnimation): Promise<void> {
        return new Promise(resolve => {
            skeleton.play(name);
            skeleton.once(Animation.EventType.FINISHED, resolve);
        });
    }

    public static getLocalPos(referenceNode: Node, target: Node): Vec3 {
        const out = new Vec3();

        referenceNode.inverseTransformPoint(out, target.worldPosition);

        return out;
    }

    public static getLocalPosFromTouch(referenceNode: Node, touch: EventTouch): Vec3 {
        const loc = touch.getUILocation();
        const world = new Vec3(loc.x, loc.y, 0);
        const out = new Vec3();

        referenceNode.inverseTransformPoint(out, world);

        return out;
    }
}
