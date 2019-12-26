export const alipayH5Utils = {
    STATUS_SUCCESS: 'statusSuccess',
    STATUS_FAIL: 'statusFail',
    SHARE: 'share',
    SHARE_OUT: 'shareOut',
    PROP_CATCH: 'propCatch',
    PROP_GOLDEN: 'golden',
    PROP_BOOM: 'boom',
    PROP_LUCKY_BUG: 'luckyBag',
    PROP_LUCKY_BUG_EMPTY: 'luckyBagEmpty',
    PROP_LUCKY_BUG_FULL: 'luckyBagFull',
    PROP_NOTHING: 'nothing',
};

/**
 * 种子随机数
 * @param {*} seed 
 */
export function seedRandom(seed, min, max) {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280.0;
    let result = min + rnd * (max - min);
    return result; 
};
