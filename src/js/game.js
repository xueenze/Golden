import { resources } from './loader';
import { Golden, Boom, LuckyBag } from './props';

export default class Game {
    constructor(width, height, bump) {
        this.stageWidth = width;
        this.stageHeight = height;
        this.bump = bump;
        this.resolution = 2;
        this.scale = 1;
        this._app = {};
        this._tickers = [];
        this._backgroundContainer_1 = {};
        this._backgroundContainer_2 = {};
        this._gameContainer = {};
        this._designWidth = 750;
        this._designHeight = 1624;

        // 矿工相关属性
        this.goldenHunter = {
            left: true,
            right: false,
            // 爪子是否转动的开关
            hookStop: false,
            // 绳子伸缩动画的开关
            ropeStop: true,
            // 绳子在伸长还是在缩短
            roteExtend: true,
            // 绳子伸长的速度
            ropeSpead: 2,
            // 绳子最长长度
            ropeMaxLength: 888,
            // 钩子初始长度
            roteInitHeight: 140,
        };

        this.goldenArea = {
            row: 3,
            column: 4,
            // 道具布局区域长宽
            initLength: 720,
            list: [],
            // 触碰到的元素序号
            hitIndex: -1,
        };

        // 奖品类型
        this.propsType = [
            // 两个金币
            'gold2',
            // 三个金币
            'gold3',
            // 四个金币
            'gold4',
            // 炸弹
            'boom',
            // 福袋
            'luckyBag',
        ];
    }

    initApp() {
        this._app = new PIXI.Application({
            width: this.stageWidth / this.resolution, 
            height: this.stageWidth * (this._designHeight / this._designWidth) / this.resolution,
            forceCanvas: true,
            resolution: this.resolution,
            backgroundColor: 0x3e2411,
            antialias: true, //消除锯齿
        });

        // 计算元素缩放比例
        this.scale = this.stageWidth / (this._designWidth * this.resolution);

        let touchStartY = 0;

        this._app.stage.interactive = true;
        this._app.stage.on('touchstart', event => {
            // console.log(event);
            // event.data.originalEvent.preventDefault();
            touchStartY = event.data.global.y;
            
            console.log(`scale: ${this.scale}`);
            console.log(`touchStartY: ${touchStartY}`);
            console.log(`stageHeight: ${this.stageHeight}`);
            console.log(`height: ${this._app.stage.height * this.resolution}`);

            const maxScroll = this.stageHeight - this._app.stage.height * this.resolution;

            console.log(`dist: ${maxScroll * this.scale * this.resolution}`);

            this._app.stage.y = maxScroll * this.scale;

        });
        this._app.stage.on('touchmove', event => {
            const maxScroll = this.stageHeight * this.resolution - this._app.stage.height / this.scale;
            const distY = event.data.global.y - touchStartY;
            console.log(this._app.stage.height);

            // this._app.stage.y = this._app.stage.y - maxScroll * this.scale;

            // if (this._app.stage.y + distY * this.scale < 0) {
            //     this._app.stage.y = (this._app.stage.y + distY) * this.scale;

            //     // console.log(this._app.stage.y);
            // }
        });
        
        document.getElementById('stage').appendChild(this._app.view);

        console.log('PIXI初始化完毕');
    }

    initStage() {
        this.initEarthBackground();
        this.initMainBackground();
        console.log('舞台初始化完毕');
    }

    /**
     * 初始化地表
     */
    initEarthBackground() {
        // 图层1
        this._backgroundContainer_1 = new PIXI.Container();
        this._app.stage.addChild(this._backgroundContainer_1);

        const { background1, logo } = resources;

        background1.sprite.scale.set(this.scale, this.scale);
        this._backgroundContainer_1.addChild(background1.sprite);

        logo.sprite.scale.set(this.scale,this.scale);
        logo.sprite.position.set(
            580 * this.scale,
            30 * this.scale)
        this._backgroundContainer_1.addChild(logo.sprite);

        // 图层2
        this._backgroundContainer_2 = new PIXI.Container();
        this._app.stage.addChild(this._backgroundContainer_2);

        const { background2 } = resources;

        background2.sprite.scale.set(this.scale, this.scale);
        this._backgroundContainer_2.addChild(background2.sprite);

        let background2Top = background1.sprite.height - background2.sprite.height;
        this._backgroundContainer_2.y = background2Top;
        
        // 开始游戏按钮
        const { startGame } = resources;
        startGame.sprite.pivot.x = startGame.sprite.width / 2;
        startGame.sprite.x = this._backgroundContainer_2.width / 2;
        startGame.sprite.scale.set(this.scale, this.scale);
        startGame.sprite.y = 1000 * this.scale;
        this._backgroundContainer_2.addChild(startGame.sprite);

        startGame.sprite.buttonMode = true;
        startGame.sprite.interactive = true;
        startGame.sprite.on('pointertap', () => {
            if (this.goldenHunter.ropeStop) {
                this.goldenHunter.hookStop = true;
                this.goldenHunter.ropeStop = false;
                this.goldenHunter.roteExtend = true;
            }
        });

        console.log('地表初始化完毕');
    }

    /**
     * 初始化游戏层
     */
    initMainBackground() {
        this._gameContainer = new PIXI.Container();
        this._gameContainer.y = 160 * this.scale;

        this._app.stage.addChild(this._gameContainer);


        this.initGoldenCar();
        this.initProps();
    }

    /**
     * 初始化矿车
     */
    initGoldenCar() {
        // 创建矿车容器
        const goldenCarContainer = new PIXI.Container();
        this._gameContainer.addChild(goldenCarContainer);

        const { goldenCar } = resources;

        goldenCar.sprite.scale.set(this.scale, this.scale);
        goldenCar.sprite.x = 344 * this.scale;
        goldenCarContainer.addChild(goldenCar.sprite);

        // 创建一个矩形容器
        const ropeContainer = new PIXI.Container();
        // ropeContainer.position.set(313 * this.scale, 142 * this.scale);

        goldenCarContainer.addChild(ropeContainer);

        // 画一个矩形
        const rope = new PIXI.Graphics();
        rope.beginFill(0x64371f);
        rope.drawRect(48 * this.scale, 0, 4 * this.scale, this.goldenHunter.roteInitHeight * this.scale);
        rope.endFill();
        ropeContainer.addChild(rope);

        // 创建爪子
        const { goldenHook } = resources;
        goldenHook.sprite.scale.set(this.scale, this.scale);
        goldenHook.sprite.position.set(
            goldenHook.sprite.width / 2, this.goldenHunter.roteInitHeight * this.scale + goldenHook.sprite.height / 2);
        // goldenHook.sprite.circular = true;
        // goldenHook.sprite.diameter = true;
        goldenHook.sprite.anchor.set(0.5);
        ropeContainer.addChild(goldenHook.sprite);

        ropeContainer.pivot.x = ropeContainer.width / 2;
        ropeContainer.pivot.y = 0;
        ropeContainer.position.set(372 * this.scale, 150 * this.scale);

        // let rectangle = new PIXI.Graphics();
        // rectangle.beginFill(0x000000);
        // rectangle.drawRect(0, 0, ropeContainer.width, ropeContainer.height);
        // rectangle.endFill();

        // ropeContainer.addChild(rectangle);

        // 爪子转动动画
        this._app.ticker.add(delta => {
            if (this.goldenHunter.left && !this.goldenHunter.hookStop) {
                ropeContainer.rotation += 0.01 * delta;
                if (ropeContainer.rotation > 0.8) {
                    this.goldenHunter.left = false;
                    this.goldenHunter.right = true;
                }
            }

            if (this.goldenHunter.right && !this.goldenHunter.hookStop) {
                ropeContainer.rotation -= 0.01 * delta;
                if (ropeContainer.rotation < -0.8) {
                    this.goldenHunter.left = true;
                    this.goldenHunter.right = false;
                }
            }
        });

        // 绳子伸长动画
        this._app.ticker.add(delta => {
            if (!this.goldenHunter.ropeStop) {
                if (this.goldenHunter.roteExtend) {
                    if (rope.height <= this.goldenHunter.ropeMaxLength * this.scale) {
                        rope.height += this.goldenHunter.ropeSpead * delta;
                        goldenHook.sprite.y += this.goldenHunter.ropeSpead * delta;

                        // 碰撞检测
                        for (let i = 0;i < this.goldenArea.list.length;i++) {
                            let prop = this.goldenArea.list[i];
                            if (prop.sprite.visible) {
                                if (this.bump.hit(
                                    goldenHook.sprite, prop.sprite, false, false, true)) {
                                    this.goldenHunter.roteExtend = false;
                                    prop.sprite.visible = false;

                                    this.distinguish(prop);
                                    break;
                                }
                            }
                        }
                    } else {
                        this.goldenHunter.roteExtend = false;
                    }
                } else {
                    if (rope.height >= this.goldenHunter.roteInitHeight * this.scale) {
                        rope.height -= this.goldenHunter.ropeSpead * delta;
                        goldenHook.sprite.y -= this.goldenHunter.ropeSpead * delta;
                    } else {
                        rope.height = this.goldenHunter.roteInitHeight * this.scale;
                        goldenHook.sprite.y = this.goldenHunter.roteInitHeight * this.scale + goldenHook.sprite.height / 2;
                        this.goldenHunter.ropeStop = true;
                        this.goldenHunter.hookStop = false;
                    }
                }
            }
        });
    }

    /**
     * 初始化道具
     */
    initProps() {
        const propsContainer = new PIXI.Container();
        this._gameContainer.addChild(propsContainer);

        // 道具层每一个道具的偏移量
        const offsetX = (this._designWidth - this.goldenArea.initLength) / 2;
        const offsetY = 450;
        
        // 格子总数
        const sum =  this.goldenArea.row * this.goldenArea.column;
        // 容器宽度
        const containerWidth = this.goldenArea.initLength / this.goldenArea.column;
        // 容器高度
        const containerHeight = this.goldenArea.initLength / this.goldenArea.row;

        for (let i = 0;i < sum;i++) {
            const rowIndex = parseInt(i / this.goldenArea.column, 10);
            const columnIndex = i % this.goldenArea.column;
            const x = offsetX + columnIndex * containerWidth + Math.random() * (containerWidth / 2);
            const y = offsetY + rowIndex * containerHeight + Math.random() * (containerHeight / 2);

            const propIndex = parseInt(Math.random() * 5, 10);

            let prop = {};
            switch(propIndex) {
                case 0:
                prop = new Golden(i, 2, x, y, this.scale, propsContainer);
                break;
                case 1:
                prop = new Golden(i, 3, x, y, this.scale, propsContainer);
                break;
                case 2:
                prop = new Golden(i, 4, x, y, this.scale, propsContainer);
                break;
                case 3:
                prop = new Boom(i, x, y, this.scale, propsContainer);
                break;
                case 4:
                case 5:
                prop = new LuckyBag(i, x, y, this.scale, propsContainer);
                break;
            }

            prop.render();
            this.goldenArea.list.push(prop);
        }
    }

    init() {
        this.initApp();
        this.initStage();
    }
};

/**
 * 判断是什么类型的道具
 */
Game.prototype.distinguish = function(prop) {
    if (prop instanceof Golden) {
        switch(prop.quantity) {
            case 2: 
                alert('两个金币！');
                break;
            case 3: 
                alert('三个金币！');
                break;
            case 4: 
                alert('四个金币！');
                break;
        }
    }

    if (prop instanceof Boom) {
        alert('抓到了炸弹！');
    }

    if (prop instanceof LuckyBag) {
        alert('抓到了福袋！');
    }
};
