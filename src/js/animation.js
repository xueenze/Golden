import { TweenMax, TimelineMax } from 'gsap';
import { resources } from './loader';

/**
 * 播放金币上浮动画
 * @param {*} container 
 * @param {*} scale 
 */
export function playFloatGolden(container, scale) {
    const { goldenFloat } = resources;
    const sp = new PIXI.Sprite(PIXI.Texture.fromImage(goldenFloat.url));
    sp.scale.set(scale, scale);
    sp.position.set(120 * scale, 120 * scale);
    sp.alpha = 0;
    container.addChild(sp);

    var tl = new TimelineMax();

    tl.add(TweenMax.to(sp, 1, {
        alpha: 1,
        y: 90 * scale,
    }));

    tl.add(TweenMax.to(sp, 0.5, {
        alpha: 0,
        y: 60 * scale,
    }));

    tl.play();
};

/**
 * 金币放大动画
 * @param {*} sp 
 */
export function playGoldenBoost(sp) {
    return;
    TweenMax.to(sp, 1, {
        width: sp.width * 1.05,
        height: sp.height * 1.05,
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
    });
};

export function playPropTada(sp) {
    return;
    var tl = new TimelineMax({
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
    });

    tl.add(TweenMax.to(sp, 0.5, {
        rotation: -0.03,
    }));

    tl.add(TweenMax.to(sp, 0.5, {
        rotation: 0.03,
    }));

    tl.add(TweenMax.to(sp, 1, {
        width: sp.width * 1.05,
        height: sp.height * 1.05,
        // rotation: 0.3,
    }));

    tl.play();
}