
/**
 * @private
 * Мерджит поля объекта dst с полями объекта src,
 * если они являются примитивными типами.
 * @param {Morphine} dst Целевой объект для мерджа
 * @param {Morphine} src Исходный объект для мерджа
 */
function MergeObjects (dst, src) {
    for (var key in src) {
        if (!src.has(key) || src.isUndefined(key) || src.isNull(key)) continue;

        if (checkType(src[key].constructor)) {
            dst[key] = src[key];
        } else {
            if (dst && !dst.has(key)) {
                if (src[key].isArray()) {
                    dst[key] = new MorphineArray();
                } else if (src[key].isObject()) {
                    dst[key] = new Morphine();
                }
            }
            MergeObjects(dst[key], src[key]);
        }
    }
    return dst;
}

/**
 * @private
 * Проверяет соответствие фактического типа real примитивным типам.
 * Если задан ожидаемый тип expect, то проверяется соответствие только с ним.
 */
function checkType (real, expect) {
    expect = expect ? [expect] : [Boolean, String, Number];
    var ln = expect.length;
    for (var i = 0; i < ln; i++) {
        if (expect[i] === real) {
            return true;
        }
    }
    return false;
}
