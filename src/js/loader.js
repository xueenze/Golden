import Params from './params';

export const resources = {
    background1: {
        url: `${Params.oss_domain_fengdie}/static/Images/background-1.jpg?${new Date().getTime()}`,
        sprite: '',
    },
    background2: {
        url: `${Params.oss_domain_fengdie}/static/Images/background-2.png?${new Date().getTime()}`,
        sprite: '',
    },
    logo: {
        url: `${Params.oss_domain_fengdie}/static/Images/logo.png?${new Date().getTime()}`,
        sprite: '',
    },
    goldenCar: {
        url: `${Params.oss_domain_fengdie}/static/Images/golden_car.png?`,
        sprite: '',
    },
    goldenHook: {
        url: `${Params.oss_domain_fengdie}/static/Images/golden_hook.png?${new Date().getTime()}`,
        sprite: '',
    },
    buttonStart: {
        url: `${Params.oss_domain_fengdie}/static/Images/button_start.png`,
        sprite: '',
    },
    buttonBack: {
        url: `${Params.oss_domain_fengdie}/static/Images/button_back.png`,
        sprite: '',
    },
    buttonShare: {
        url: `${Params.oss_domain_fengdie}/static/Images/button_share.png`,
        sprite: '',
    },
    boom: {
        url: `${Params.oss_domain_fengdie}/static/Images/boom.png`,
        sprite: '',
    },
    gold1: {
        url: `${Params.oss_domain_fengdie}/static/Images/gold_1.png`,
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
    dialogClose: {
        url: `${Params.oss_domain_fengdie}/static/Images/close.png`,
        sprite: '',
    },
    propHalo: {
        url: `${Params.oss_domain_fengdie}/static/Images/halo.png`,
        sprite: '',
    },
    dialogBoom: {
        url: `${Params.oss_domain_fengdie}/static/Images/dialog_boom.png`,
        sprite: '',
    },
    dialogBagEmpty: {
        url: `${Params.oss_domain_fengdie}/static/Images/dialog_bag_empty.png`,
        sprite: '',
    },
    dialogBagGoldenFull: {
        url: `${Params.oss_domain_fengdie}/static/Images/dialog_bag_golden_full.png`,
        sprite: '',
    },
    dialogBagHongBaoFull: {
        url: `${Params.oss_domain_fengdie}/static/Images/dialog_bag_hongbao_full.png`,
        sprite: '',
    },
    head: {
        url: `${Params.oss_domain_fengdie}/static/Images/head.png`,
        sprite: '',
    },
    coinsContainer: {
        url: `${Params.oss_domain_fengdie}/static/Images/coins_container.png`,
        sprite: '',
    },
    iconText: {
        url: `${Params.oss_domain_fengdie}/static/Images/icon_text.png`,
        sprite: '',
    },
    textBottomHasChance: {
        url: `${Params.oss_domain_fengdie}/static/Images/text_bottom_has_chance.png`,
        sprite: '',
    },
    textBottomChanceOut: {
        url: `${Params.oss_domain_fengdie}/static/Images/text_bottom_chance_out.png`,
        sprite: '',
    },
    goldenFloat: {
        url: `${Params.oss_domain_fengdie}/static/Images/golden_float.png`,
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

    // loading 监听
    PIXI.loader.on('progress', function(target) {
        // if (progress == 100) {
        //     $('body').removeClass('loading').scrollTop(0);
        //     console.log('所有资源初始化完毕');
        // }
    });

    function setup() {
        console.log('资源加载完成');
        Object.keys(resources).forEach(key => {
            resources[key].sprite  = new PIXI.Sprite(PIXI.loader.resources[resources[key].url].texture);
        });

        var progress = 0;
        var loadingIntervalHandler = setInterval(() => {
            progress += 5;
            $('.bar-active').css('width', `${progress}%`);
            $('.bar-car').css('left', `${progress}%`);
            $('.bar-progress').text(`${progress}%`);

            if (progress == 100) {
                clearInterval(loadingIntervalHandler);
                $('body').removeClass('loading').scrollTop(0);
                console.log('所有资源初始化完毕');
                cb();
            }
        }, 50);
        // cb();
    }
};