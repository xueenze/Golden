import { resources } from './loader';
import { Golden, Boom, LuckyBag, Ghost } from './props';
import { alipayH5Utils, seedRandom } from './utils';
import * as AnimationOptions from './animation';

import './lib/AlloyTouch';
import './lib/Transform';

// 机会次数样式
const chanceCountStyle = new PIXI.TextStyle({
    fontFamily: 'PingFangSC-Regular, sans-serif',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
    fill: '#ffe02e',
});

// 积分信息样式
const coinsTextStyle = new PIXI.TextStyle({
    fontFamily: 'PingFangSC-Regular, sans-serif',
    fontSize: 28,
    lineHeight: 28,
    fill: '#fedb38',
});

// 中奖文案title
const dialogTitleStyle = new PIXI.TextStyle({
    fontFamily: 'PingFangSC-Regular, sans-serif',
    fontWeight: 'bold',
    fontSize: 62,
    lineHeight: 62,
    fill: '#ffffff',
    stroke: '#c97722',
    strokeThickness: 8,
});

// 中奖文案subtitle
const dialogSubTitleStyle = new PIXI.TextStyle({
    fontFamily: 'PingFangSC-Regular, sans-serif',
    fontWeight: 'bold',
    fontSize: 43,
    lineHeight: 43,
    fill: '#ffebac',
    stroke: '#c97722',
    strokeThickness: 10,
});

export default class Game {
    constructor(width, height, bump) {
        this.stageWidth = width;
        this.stageHeight = height;
        this.bump = bump;
        this.coins = 0; // 当前金币数量
        this.playCount = 0; // 已经玩的次数
        this.cells = []; // 格子分布情况
        this.chances = 0; // 一共可以玩多少次
        this.rand = 0; // 随机位置种子
        this.scale = 1;
        this._app = null;
        this._tickers = [];
        this._backgroundContainer_1 = null;
        this._backgroundContainer_2 = null;
        // 底部文案容器
        this._textBottomHasChanceContainer = null;
        // 钩子整体的容器
        this._ropeContainer = null;
        // 中奖弹窗容器
        this._dialogContainer = null;
        this._dialogData = null;
        this._gameContainer = null;
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
            // 绳子伸长的初始速度
            ropeInitSpeed: 2,
            // 绳子伸长的当前速度
            ropeCurrentSpeed: 0,
            // 绳子伸长的加速度
            ropeAcceleratedSpeed: 0.2,
            // 绳子最长长度
            ropeMaxLength: 888,
            // 钩子初始长度
            ropeInitHeight: 100,
        };

        this.goldenArea = {
            row: 3,
            column: 4,
            // 道具布局区域长宽
            initWidth: 720,
            initHeight: 680,
            list: [],
            // 触碰到的元素序号
            hitIndex: -1,
        };
    }

    initApp() {
        this._app = new PIXI.Application({
            width: this.stageWidth, 
            height: this.stageWidth * (this._designHeight / this._designWidth),
            forceCanvas: true,
            resolution: 2,
            antialias: true, //消除锯齿
            autoResize: true,
        });

        // 计算元素缩放比例
        this.scale = this.stageWidth / this._designWidth;
        
        document.getElementById('stage').appendChild(this._app.view);

        console.log('PIXI初始化完毕');
    }

    /**
     * 初始化滚动
     */
    initScroll() {
        const target = document.querySelector("#stage");
        Transform(target,true);

        const { background1 } = resources;

        new AlloyTouch({
            touch: 'body', //反馈触摸的dom
            vertical: true,//不必需，默认是true代表监听竖直方向touch
            target: target,
            property: 'translateY',  //被滚动的属性
            sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
            factor: 1,//不必需,默认值是1代表touch区域的1px的对应target.y的1
            min: -background1.sprite.height + this.stageHeight, //不必需,滚动属性的最小值
            max: 0, //不必需,滚动属性的最大值
            change: function (value) {
            },
        });

        console.log('舞台滚动初始化完毕');
    }

    initStage() {
        this.initSkyBackground();
        this.initLandBackground();
        this.initMainBackground();
        this.initPropDialogContainer();
        this.initScroll();
        console.log('舞台初始化完毕');
    }

    /**
     * 初始化天空和草地
     */
    initSkyBackground() {
        // 图层1
        this._backgroundContainer_1 = new PIXI.Container();
        this._app.stage.addChild(this._backgroundContainer_1);

        const { background1, logo, head, coinsContainer, iconText } = resources;

        background1.sprite.scale.set(this.scale, this.scale);
        this._backgroundContainer_1.addChild(background1.sprite);

        // 头像
        head.sprite.scale.set(this.scale, this.scale);
        head.sprite.position.set(
            30 * this.scale,
            30 * this.scale)
        this._backgroundContainer_1.addChild(head.sprite);

        // 积分显示容器
        coinsContainer.sprite.scale.set(this.scale, this.scale);
        coinsContainer.sprite.position.set(
            144 * this.scale,
            48 * this.scale)
        this._backgroundContainer_1.addChild(coinsContainer.sprite);

        // 积分信息
        const coinsText = new PIXI.Text();
        coinsText.scale.set(this.scale, this.scale);
        coinsText.name = 'coinsText';
        coinsText.style = coinsTextStyle;
        this._backgroundContainer_1.addChild(coinsText);
        this.updateCoinsCount(this.coins);

        // logo
        logo.sprite.scale.set(this.scale,this.scale);
        logo.sprite.position.set(
            580 * this.scale,
            30 * this.scale)
        this._backgroundContainer_1.addChild(logo.sprite);

        // Logo字
        iconText.sprite.scale.set(this.scale, this.scale);
        iconText.sprite.position.set(
            95 * this.scale,
            150 * this.scale)
        this._backgroundContainer_1.addChild(iconText.sprite);

        console.log('天空和草地初始化完毕');
    }

    /**
     * 初始化地表
     */
    initLandBackground() {
        this._backgroundContainer_2 = new PIXI.Container();
        this._app.stage.addChild(this._backgroundContainer_2);

        const { background1, background2 } = resources;

        background2.sprite.scale.set(this.scale, this.scale);
        this._backgroundContainer_2.addChild(background2.sprite);

        let background2Top = background1.sprite.height - background2.sprite.height;
        this._backgroundContainer_2.y = background2Top;
        
        const { buttonStart, buttonBack, buttonShare, textBottomHasChance, textBottomChanceOut } = resources;

        // 底部区域容器
        const bottomAreaContainer = new PIXI.Container();
        bottomAreaContainer.name = 'bottomAreaContainer';
        bottomAreaContainer.y = 880 * this.scale;
        this._backgroundContainer_2.addChild(bottomAreaContainer);

        // 开始游戏按钮
        buttonStart.sprite.pivot.x = buttonStart.sprite.width / 2;
        buttonStart.sprite.scale.set(this.scale, this.scale);
        bottomAreaContainer.addChild(buttonStart.sprite);

        buttonStart.sprite.buttonMode = true;
        buttonStart.sprite.interactive = true;
        buttonStart.sprite.on('pointertap', () => {
            if (this.goldenHunter.ropeStop) {
                this.goldenHunter.hookStop = true;
                this.goldenHunter.ropeStop = false;
                this.goldenHunter.roteExtend = true;
                // 给一个初始速度
                this.goldenHunter.ropeCurrentSpeed = this.goldenHunter.ropeInitSpeed;
            }
        });
        buttonStart.sprite.visible = false;

        // 返回游戏按钮
        buttonBack.sprite.pivot.x = buttonBack.sprite.width / 2;
        buttonBack.sprite.scale.set(this.scale, this.scale);
        bottomAreaContainer.addChild(buttonBack.sprite);

        buttonBack.sprite.buttonMode = true;
        buttonBack.sprite.interactive = true;
        buttonBack.sprite.on('pointertap', () => {
            // 点击返回按钮
        });
        buttonBack.sprite.visible = false;

        // 立即分享按钮
        buttonShare.sprite.pivot.x = buttonShare.sprite.width / 2;
        buttonShare.sprite.scale.set(this.scale, this.scale);
        bottomAreaContainer.addChild(buttonShare.sprite);

        buttonShare.sprite.buttonMode = true;
        buttonShare.sprite.interactive = true;
        buttonShare.sprite.on('pointertap', () => {
            // 点击分享按钮
        });
        buttonShare.sprite.visible = false;

        // 底部仍存在机会的容器
        this._textBottomHasChanceContainer = new PIXI.Container();
        bottomAreaContainer.addChild(this._textBottomHasChanceContainer);
        this._textBottomHasChanceContainer.y = 120 * this.scale;

        textBottomHasChance.sprite.pivot.x = textBottomHasChance.sprite.width / 2;
        textBottomHasChance.sprite.x = this._backgroundContainer_2.width / 2;
        textBottomHasChance.sprite.scale.set(this.scale, this.scale);
        this._textBottomHasChanceContainer.addChild(textBottomHasChance.sprite);

        // 次数信息
        const chanceCount = new PIXI.Text();
        chanceCount.scale.set(this.scale, this.scale);
        chanceCount.name = 'chanceCountText';
        chanceCount.style = chanceCountStyle;

        chanceCount.x = 234 * this.scale;
        chanceCount.y = 9 * this.scale;

        this._textBottomHasChanceContainer.addChild(chanceCount);

        this._textBottomHasChanceContainer.visible = false;

        // 底部无机会文案
        textBottomChanceOut.sprite.pivot.x = textBottomChanceOut.sprite.width / 2;
        textBottomChanceOut.sprite.x = this._backgroundContainer_2.width / 2;
        textBottomChanceOut.sprite.y = 120 * this.scale;
        textBottomChanceOut.sprite.scale.set(this.scale, this.scale);
        bottomAreaContainer.addChild(textBottomChanceOut.sprite);
        textBottomChanceOut.sprite.visible = false;

        this.updateBottomArea();

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
        this._ropeContainer = new PIXI.Container();
        // this._ropeContainer.position.set(313 * this.scale, 142 * this.scale);

        goldenCarContainer.addChild(this._ropeContainer);

        // 画一个矩形
        const rope = new PIXI.Graphics();
        rope.beginFill(0x64371f);
        rope.drawRect(42 * this.scale, 0, 4 * this.scale, this.goldenHunter.ropeInitHeight * this.scale);
        rope.endFill();
        this._ropeContainer.addChild(rope);

        // 创建爪子
        const { goldenHook } = resources;
        goldenHook.sprite.scale.set(this.scale, this.scale);
        goldenHook.sprite.position.set(
            goldenHook.sprite.width / 2, this.goldenHunter.ropeInitHeight * this.scale + goldenHook.sprite.height / 2);
        // goldenHook.sprite.circular = true;
        // goldenHook.sprite.diameter = true;
        goldenHook.sprite.anchor.set(0.5);
        this._ropeContainer.addChild(goldenHook.sprite);

        this._ropeContainer.pivot.x = this._ropeContainer.width / 2;
        this._ropeContainer.pivot.y = 0;
        this._ropeContainer.position.set(372 * this.scale, 150 * this.scale);

        
        // 爪子转动动画
        this._app.ticker.add(delta => {
            if (this.chances - this.playCount > 0) {
                if (this.goldenHunter.left && !this.goldenHunter.hookStop) {
                    this._ropeContainer.rotation += 0.01 * delta;
                    if (this._ropeContainer.rotation > 0.8) {
                        this.goldenHunter.left = false;
                        this.goldenHunter.right = true;
                    }
                }
    
                if (this.goldenHunter.right && !this.goldenHunter.hookStop) {
                    this._ropeContainer.rotation -= 0.01 * delta;
                    if (this._ropeContainer.rotation < -0.8) {
                        this.goldenHunter.left = true;
                        this.goldenHunter.right = false;
                    }
                }
            }
        });

        // 绳子伸长动画
        this._app.ticker.add(delta => {
            if (!this.goldenHunter.ropeStop) {
                if (this.goldenHunter.roteExtend) {
                    // 绳子伸长过程中是否碰撞到任何礼物
                    let hasHit = false;
                    if (rope.height <= this.goldenHunter.ropeMaxLength * this.scale) {
                        this.goldenHunter.ropeCurrentSpeed += this.goldenHunter.ropeAcceleratedSpeed;
                        rope.height += this.goldenHunter.ropeCurrentSpeed;
                        goldenHook.sprite.y += this.goldenHunter.ropeCurrentSpeed;

                        // 碰撞检测
                        for (let i = 0;i < this.goldenArea.list.length;i++) {
                            let prop = this.goldenArea.list[i];
                            if (!(prop instanceof Ghost)) {
                                if (prop.propContainer.visible) {
                                    if (this.bump.hit(
                                        goldenHook.sprite, prop.hitRec, false, false, true)) {
                                        this.goldenHunter.roteExtend = false;
                                        prop.propContainer.visible = false;
                                        this.distinguish(prop, i, rope.height);
                                        hasHit = true;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        this.goldenHunter.roteExtend = false;

                        if (!hasHit) {
                            this.distinguish(new Ghost());
                        }
                    }
                } else {
                    if (rope.height >= this.goldenHunter.ropeInitHeight * this.scale) {
                        rope.height -= this.goldenHunter.ropeCurrentSpeed;
                        goldenHook.sprite.y -= this.goldenHunter.ropeCurrentSpeed;
                        let hitSprite = this._ropeContainer.getChildByName('hitSprite');

                        if (hitSprite) {
                            hitSprite.position.y = 130 * this.scale + rope.height;
                        }
                    } else {
                        rope.height = this.goldenHunter.ropeInitHeight * this.scale;
                        goldenHook.sprite.y = this.goldenHunter.ropeInitHeight * this.scale + goldenHook.sprite.height / 2;
                        this.goldenHunter.ropeStop = true;
                        this.goldenHunter.hookStop = false;

                        // 钩子回来之后清空掉勾掉的元素
                        this._ropeContainer.removeChild(this._ropeContainer.getChildByName('hitSprite'));

                        // 机会用尽后不再转动钩子
                        if (this.chances == this.playCount) {
                            this.goldenHunter.ropeStop = true;
                            this.goldenHunter.hookStop = true;
                        }
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
        const offsetX = (this._designWidth - this.goldenArea.initWidth) / 2;
        const offsetY = 360;
        
        // 格子总数
        const sum =  this.goldenArea.row * this.goldenArea.column;
        // 容器宽度
        const containerWidth = this.goldenArea.initWidth / this.goldenArea.column;
        // 容器高度
        const containerHeight = this.goldenArea.initHeight / this.goldenArea.row;

        for (let i = 0;i < sum;i++) {
            const rowIndex = parseInt(i / this.goldenArea.column, 10);
            const columnIndex = i % this.goldenArea.column;
            let random = seedRandom(i * this.rand, 0, 1);

            const x = offsetX + columnIndex * containerWidth + random * (containerWidth / 2);
            const y = offsetY + rowIndex * containerHeight + random * (containerHeight / (random * (i % 3 ? 4 : 2)));

            // 容器外壳
            // const g = new PIXI.Graphics();
            // g.lineStyle(2, 0xFF00FF, 1);
            // g.beginFill(0x650A5A, 0.25);
            // g.drawRoundedRect(
            //     (offsetX + columnIndex * containerWidth) * this.scale, 
            //     (offsetY + rowIndex * containerHeight) * this.scale, 
            //     containerWidth * this.scale, 
            //     containerHeight * this.scale,
            // );
            // g.endFill();
            // propsContainer.addChild(g);

            let prop = {};
            switch(this.cells[i].type) {
                case 'coin':
                    prop = new Golden(i, this.cells[i].amount, x, y, this.scale, propsContainer);
                    break;
                case 'landmine':
                    prop = new Boom(i, x, y, this.scale, propsContainer);
                    break;
                case 'lootbox':
                    prop = new LuckyBag(i, x, y, this.scale, propsContainer);
                    break;
                case 'blank':
                    prop = new Ghost(i, x, y, this.scale, propsContainer);
                    break;
            }

            prop.render();
            this.goldenArea.list.push(prop);
        }
    }

    /**
     * 初始化道具弹窗
     */
    initPropDialogContainer() {
        this._dialogContainer = new PIXI.Container();
        this._app.stage.addChild(this._dialogContainer);

        const mask = new PIXI.Graphics();
        mask.beginFill(0x000000, 0.5);
        mask.drawRect(
            0, 0, 
            this._app.stage.width,
            this._app.stage.height,
        );
        mask.endFill();
        this._dialogContainer.addChild(mask);

        const { propHalo, dialogClose } = resources;

        // 初始化光晕
        propHalo.sprite.scale.set(this.scale, this.scale);
        propHalo.sprite.position.set(
            this._dialogContainer.width / 2, 
            this._dialogContainer.height / 2 - 100 * this.scale);
        propHalo.sprite.anchor.set(0.5);
        this._dialogContainer.addChild(propHalo.sprite);

        // 初始化关闭按钮
        dialogClose.sprite.scale.set(this.scale, this.scale);
        dialogClose.sprite.position.set(
            this._dialogContainer.width / 2 + propHalo.sprite.width / 3, 
            this._dialogContainer.height / 2 - propHalo.sprite.height / 3 - 100 * this.scale,
        );
        dialogClose.sprite.anchor.set(0.5);
        dialogClose.sprite.interactive = true;
        dialogClose.sprite.on('pointertap', () => {
            this.hidePropDialog();
        });
        this._dialogContainer.addChild(dialogClose.sprite);

        let prizeMainContainer = new PIXI.Container();
        prizeMainContainer.name = 'prizeMainContainer';
        this._dialogContainer.addChild(prizeMainContainer);

        this._dialogContainer.visible = false;

        console.log('道具弹窗初始化完毕');
    }

    /**
     * 弹出奖品弹窗
     */
    showPropDialog(prop) {
        this._dialogContainer.visible = true;
        
        let prizeMainContainer = this._dialogContainer.getChildByName('prizeMainContainer');
        prizeMainContainer.removeChildren();

        const { buttonStart, gold1, gold2, gold3, gold4, dialogBoom, dialogBagEmpty, dialogBagGoldenFull, dialogBagHongBaoFull } = resources;

        // 获奖主文案
        const prizeTitleText = new PIXI.Text();
        prizeTitleText.anchor.set(0.5);
        prizeTitleText.scale.set(this.scale, this.scale);
        prizeTitleText.style = dialogTitleStyle;
        prizeTitleText.position.set(
            this._dialogContainer.width / 2, 
            this._dialogContainer.height / 2 + 150 * this.scale,
        );
        prizeMainContainer.addChild(prizeTitleText);

        // 获奖副文案
        const prizeSubTitleText = new PIXI.Text();
        prizeSubTitleText.anchor.set(0.5);
        prizeSubTitleText.scale.set(this.scale, this.scale);
        prizeSubTitleText.style = dialogSubTitleStyle;
        prizeSubTitleText.position.set(
            this._dialogContainer.width / 2, 
            this._dialogContainer.height / 2 + 220 * this.scale,
        );
        prizeMainContainer.addChild(prizeSubTitleText);

        // 禁用开始游戏按钮的点击 
        buttonStart.sprite.interactive = false;

        // 初始化抓到的奖品
        const { data } = prop;
        let prizeIconSprite = null;
        switch(prop.type) {
            case alipayH5Utils.PROP_GOLDEN:
                if (data.amount == 1) {
                    prizeIconSprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold1.url));
                }
                if (data.amount == 2) {
                    prizeIconSprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold2.url));
                }
                if (data.amount == 3) {
                    prizeIconSprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold3.url));
                }
                if (data.amount == 4) {
                    prizeIconSprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold4.url));
                }

                prizeIconSprite.scale.set(this.scale * 2.5, this.scale * 2.5);
                prizeTitleText.text = '恭喜你';
                prizeSubTitleText.text = `获得了${data.amount}个金币`;

                AnimationOptions.playFloatGolden(prizeMainContainer, this.scale);
                break;
            case alipayH5Utils.PROP_BOOM:
                // 初始化炸弹
                prizeIconSprite = new PIXI.Sprite(PIXI.Texture.fromImage(dialogBoom.url));
                prizeIconSprite.scale.set(this.scale, this.scale);

                prizeTitleText.text = '哎呀 碰到地雷了';
                // prizeSubTitleText.text = '游戏机会少一次';
                break;
            case alipayH5Utils.PROP_LUCKY_BUG_EMPTY:
                // 初始化空福袋
                prizeIconSprite = new PIXI.Sprite(PIXI.Texture.fromImage(dialogBagEmpty.url));
                prizeIconSprite.scale.set(this.scale, this.scale);

                prizeTitleText.text = '真遗憾';
                prizeSubTitleText.text = '福袋竟然是空的';
                break;
            case alipayH5Utils.PROP_LUCKY_BUG_FULL:
                prizeTitleText.text = '恭喜你';
                // 初始化满满的福袋
                if (data.type == 'coin') {
                    prizeIconSprite = new PIXI.Sprite(PIXI.Texture.fromImage(dialogBagGoldenFull.url));
                    prizeSubTitleText.text = `获得了${data.amount}个金币`;
                    AnimationOptions.playFloatGolden(prizeMainContainer, this.scale);
                } else {
                    prizeIconSprite = new PIXI.Sprite(PIXI.Texture.fromImage(dialogBagHongBaoFull.url));
                    prizeSubTitleText.text = `获得了${data.name}`;
                }
                
                prizeIconSprite.scale.set(this.scale, this.scale);
                break;
        }

        // 设置显示的奖品
        prizeIconSprite.anchor.set(0.5);
        prizeIconSprite.position.set(
            this._dialogContainer.width / 2, 
            this._dialogContainer.height / 2 - 100 * this.scale,
        );
        prizeMainContainer.addChild(prizeIconSprite);
    }

    /**
     * 隐藏道具弹窗
     */
    hidePropDialog() {
        const { buttonStart } = resources;
        // 恢复开始游戏按钮的点击 
        buttonStart.sprite.interactive = true;

        this._dialogContainer.visible = false;
    }

    /**
     * 更新金币显示数量
     * @param {*} coins 
     */
    updateCoinsCount(coins) {
        const coinsText = this._backgroundContainer_1.getChildByName('coinsText');
        coinsText.text = coins;
        // 这里我们假定金币数量最多到10000，因此位数是5位
        coinsText.x = (200 + (5 - String(coins).length) * 10) * this.scale;
        coinsText.y = 60 * this.scale;
    }

    /**
     * 更新底部区域显示元素
     */
    updateBottomArea() {
        const { buttonStart, buttonBack, buttonShare, textBottomChanceOut } = resources;

        this._textBottomHasChanceContainer.getChildByName('chanceCountText').text = this.chances - this.playCount;

        if (this.chances - this.playCount > 0) {
            buttonStart.sprite.x = this._backgroundContainer_2.width / 2;

            buttonStart.sprite.visible = true;
            buttonBack.sprite.visible = false;
            buttonShare.sprite.visible = false;
            this._textBottomHasChanceContainer.visible = true;
            textBottomChanceOut.sprite.visible = false;
        } else if (this.shares == 0) {
            // this.goldenHunter.ropeStop = true;
            buttonShare.sprite.x = this._backgroundContainer_2.width / 2;

            buttonStart.sprite.visible = false;
            buttonBack.sprite.visible = false;
            buttonShare.sprite.visible = true;
            this._textBottomHasChanceContainer.visible = true;
            textBottomChanceOut.sprite.visible = false;
        } else {
            // this.goldenHunter.ropeStop = true;
            buttonBack.sprite.x = this._backgroundContainer_2.width / 2;

            buttonStart.sprite.visible = false;
            buttonBack.sprite.visible = true;
            buttonShare.sprite.visible = false;
            this._textBottomHasChanceContainer.visible = false;
            textBottomChanceOut.sprite.visible = true;
        }
    }

    /**
     * 判断是什么类型的道具
     * @param {*} prop 
     * @param {*} cell 
     */
    distinguish(prop, cell, ropeHeight) {
        // 初始化钩子勾到的元素
        // this._ropeContainer.removeChild(this._ropeContainer.getChildByName('hitSprite'));
        const { gold1, gold2, gold3, gold4, boom, luckyBag, goldenHook } = resources;

        if (prop instanceof Golden) {
            this._dialogData = {
                type: alipayH5Utils.PROP_GOLDEN,
                data: {
                    amount: prop.quantity,
                },
            };

            let hitSprite;
            switch(prop.quantity) {
                case 1:
                    hitSprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold1.url));
                    break;
                case 2:
                    hitSprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold2.url));
                    break;
                case 3:
                    hitSprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold3.url));
                    break;
                case 4:
                    hitSprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold4.url));
                    break;
            }

            this.coins += prop.quantity;

            hitSprite.name = 'hitSprite';
            hitSprite.anchor.set(0.5);
            hitSprite.scale.set(this.scale * 0.7, this.scale * 0.7);
            hitSprite.position.set(
                goldenHook.sprite.width / 2, 130 * this.scale + ropeHeight,
            );
            this._ropeContainer.addChild(hitSprite);
        }
    
        if (prop instanceof Boom) {
            this._dialogData = {
                type: alipayH5Utils.PROP_BOOM,
            };

            let hitSprite = new PIXI.Sprite(PIXI.Texture.fromImage(boom.url));
            hitSprite.name = 'hitSprite';
            hitSprite.anchor.set(0.5);
            hitSprite.scale.set(this.scale * 0.7, this.scale * 0.7);
            hitSprite.position.set(
                goldenHook.sprite.width / 2, 130 * this.scale + ropeHeight,
            );
            this._ropeContainer.addChild(hitSprite);
        }
    
        if (prop instanceof LuckyBag) {
            this._dialogData = {
                type: alipayH5Utils.PROP_LUCKY_BUG_EMPTY,
                // type: alipayH5Utils.PROP_LUCKY_BUG_FULL,
            };

            let hitSprite = new PIXI.Sprite(PIXI.Texture.fromImage(luckyBag.url));
            hitSprite.name = 'hitSprite';
            hitSprite.anchor.set(0.5);
            hitSprite.scale.set(this.scale * 0.7, this.scale * 0.7);
            hitSprite.position.set(
                goldenHook.sprite.width / 2, 130 * this.scale + ropeHeight,
            );
            this._ropeContainer.addChild(hitSprite);
        }

        if (prop instanceof Ghost) {
            this._dialogData = {
                type: alipayH5Utils.PROP_NOTHING,
            };
        }

        if (!(prop instanceof Ghost)) {
            this.updateCoinsCount(this.coins);
            this.showPropDialog(this._dialogData);
        }

        this.playCount++;
        this.updateBottomArea();
    }

    init(coins, playCount, cells, chances, shares, rand) {
        this.coins = coins;
        this.playCount = playCount;
        this.cells = cells;
        this.chances = chances;
        this.shares = shares;
        this.rand = rand;

        this.initApp();
        this.initStage();
    }
};
