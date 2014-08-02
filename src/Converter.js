
function converter (obj) {
    var morph = this;
    if (obj.constructor === Object) {
        ConvertObject(obj, morph);
    } else
    if (obj.constructor === Array) {
        ConvertArray(obj, morph);
    }
    return morph;
}

function ConvertObject (obj, morph) {
    var morph = morph || new Morphine();
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        if (obj[key].constructor === Object) {
            //morph.set(key, new Morphine());
            morph.set(key, ConvertObject(obj[key]));
        } else
        if (obj[key].constructor === Array) {
            morph.set(key, ConvertArray(obj[key]));
        } else
        if (obj[key].constructor === String || obj[key].constructor === Boolean || obj[key].constructor === Number) {
            morph.set(key, obj[key]);
        } else {
            console.error("Конструктор не определен %o %o %o", obj, key, obj[key]);
        }
    }
    return morph;
}

function ConvertArray (obj, morph) {
    var morph = morph || new MorphineArray(),
        ln = obj.length;

    for (var key = 0; key < ln; key++) {
        if (obj[key].constructor === Object) {
            morph.push(ConvertObject(obj[key]));
        } else
        if (obj[key].constructor === Array) {
            morph.push(ConvertArray(obj[key]));
        } else
        if (obj[key].constructor === String || obj[key].constructor === Boolean || obj[key].constructor === Number) {
            morph.push(obj[key]);
        } else {
            console.error("Конструктор не определен %o %o %o", obj, key, obj[key]);
        }
    }
    return morph;
}
