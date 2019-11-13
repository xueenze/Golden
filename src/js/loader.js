import Params from './params';

export const resources = {
    background1: {
        url: `${Params.oss_domain_fengdie}/static/Images/background-1.png`,
        sprite: '',
    },
    background2: {
        url: `${Params.oss_domain_fengdie}/static/Images/background-2.png`,
        sprite: '',
    },
    logo: {
        url: `${Params.oss_domain_fengdie}/static/Images/logo.png`,
        sprite: '',
    },
    goldenCar: {
        url: `${Params.oss_domain_fengdie}/static/Images/golden_car.png`,
        sprite: '',
    },
    goldenHook: {
        url: `${Params.oss_domain_fengdie}/static/Images/golden_hook.png`,
        sprite: '',
    },
    startGame: {
        url: `${Params.oss_domain_fengdie}/static/Images/start_game.png`,
        sprite: '',
    },
    boom: {
        url: `${Params.oss_domain_fengdie}/static/Images/boom.png`,
        sprite: '',
    },
    gold2: {
        url: `${Params.oss_domain_fengdie}/static/Images/gold_2.png`,
        sprite: '',
    },
    gold3: {
        url: `${Params.oss_domain_fengdie}/static/Images/gold_3.png`,
        sprite: '',
    },
    gold4: {
        url: `${Params.oss_domain_fengdie}/static/Images/gold_4.png`,
        sprite: '',
    },
    luckyBag: {
        url: `${Params.oss_domain_fengdie}/static/Images/lucky_bag.png`,
        sprite: '',
    },
};

/**
 * 加载资源
 */
export function loadAssets(cb) {
    PIXI.loader
        .add([
            ...Object.keys(resources).map(key => {
                return resources[key].url;
            })
        ])
        .load(setup);


    function setup() {
        console.log('资源加载完成');
        Object.keys(resources).forEach(key => {
            resources[key].sprite  = new PIXI.Sprite(PIXI.loader.resources[resources[key].url].texture);
        });
        cb();
    }
};