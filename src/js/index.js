import 'babel-polyfill';
import * as PIXI from 'pixi.js';
import Bump from './lib/Bump';
import Game from './game';
import { loadAssets } from './loader';

import '../css/index.less';

require("expose-loader?$!jquery");

const width = $(window).width();
const height = $(window).height();

console.log(width, height);

// 加载资源后开始初始化舞台相关内容
loadAssets(() => {
    const bump = new Bump(PIXI);
    const game = new Game(width, height, bump);
    game.init();
});
