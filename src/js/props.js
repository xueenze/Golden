import { resources } from './loader';

/**
 * 基础道具类
 */
class Props {
    constructor(id, x, y, scale, container) {
        this._id = id;
        this._x = x;
        this._y = y;
        this._scale = scale;
        this._container = container;
    }

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set x(x) {
        this._x = x;
    }

    get x() {
        return this._x;
    }

    set y(y) {
        this._y = y;
    }

    get y() {
        return this._y;
    }

    set scale(scale) {
        this._scale = scale;
    }

    get scale() {
        return this._scale;
    }

    set container(container) {
        this._container = container;
    }

    get container() {
        return this._container;
    }
}

/**
 * 金币对象
 */
export class Golden extends Props{
    constructor(id, quantity, x, y, scale, container) {
        super(id, x, y, scale, container);
        this.quantity = quantity;
        this.sprite = {};
    }

    /**
     * 渲染元素
     */
    render() {
        const { gold2, gold3, gold4 } = resources;

        switch(this.quantity) {
            case 2:
            this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold2.url));
            break;
            case 3:
            this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold3.url));
            break;
            case 4:
            this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold4.url));
            break;
        }

        // const graphics = new PIXI.Graphics();
        // graphics.beginFill(0xFF3300);
        // graphics.drawRect(5, 5, 10, 10);
        // graphics.endFill();
        // this.sprite.mask = graphics;

        // this.sprite.circular = true;
        this.sprite.anchor.set(0.5);
        // this.sprite.diameter = true;

        this.sprite.scale.set(
            super.scale, super.scale);
        this.sprite.position.set(
            super.x * super.scale + this.sprite.width / 2, 
            super.y * super.scale + this.sprite.height / 2);

        super.container.addChild(this.sprite);
    }
    
};

/**
 * 炸弹对象
 */
export class Boom extends Props{
    constructor(id, x, y, scale, container) {
        super(id, x, y, scale, container);
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage(resources.boom.url));
    }

    /**
     * 渲染元素
     */
    render() {
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(
            super.scale, super.scale);
        this.sprite.position.set(
            super.x * super.scale + this.sprite.width / 2, 
            super.y * super.scale + this.sprite.height / 2);
        super.container.addChild(this.sprite);
    }
};

/**
 * 福袋对象
 */
export class LuckyBag extends Props{
    constructor(id, x, y, scale, container) {
        super(id, x, y, scale, container);
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage(resources.luckyBag.url));
    }

    /**
     * 渲染元素
     */
    render() {
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(
            super.scale, super.scale);
        this.sprite.position.set(
            super.x * super.scale + this.sprite.width / 2, 
            super.y * super.scale + this.sprite.height / 2);
        super.container.addChild(this.sprite);
    }
};