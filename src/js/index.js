import 'babel-polyfill';
import * as PIXI from 'pixi.js';
import Bump from './lib/Bump';
import Game from './game';
import { loadAssets } from './loader';
import Vconsole from 'vconsole';

import '../css/index.less';

require("expose-loader?$!jquery");

// const vConsole = new Vconsole();

const width = $(window).width();
const height = $(window).height();

// 加载资源后开始初始化舞台相关内容
loadAssets(() => {
    const bump = new Bump(PIXI);
    const game = new Game(width, height, bump);
    game.init(
        100,
        0,
        [
            { type: 'coin', amount: 1 },
            { type: 'coin', amount: 2 },
            { type: 'coin', amount: 3 },
            { type: 'coin', amount: 4 },
            { type: 'landmine' },
            { type: 'coin', amount: 4 },
            { type: 'coin', amount: 2 },
            { type: 'coin', amount: 2 },
            { type: 'lootbox' },
            { type: 'coin', amount: 1 },
            { type: 'landmine' },
            { type: 'coin', amount: 2 },
        ],
        5,
        1,
        0.28928509735715935,
    );
});
