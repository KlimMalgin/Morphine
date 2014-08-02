
function stringify() {
    var currentString = "";
    if (this.isObject()) {
        currentString = ObjectToString(this);
    } else if (this.isArray()) {
        currentString = ArrayToString(this);
    }
    return currentString;
}

function ObjectToString (obj) {
    var start = "{", end = "}",
        result = [], item = "";
    for (var key in obj) {
        if (!obj.has(key)) continue;
        item += "\"" + key + "\":";
        if (obj[key].isObject && obj[key].isObject()) {
            item += ObjectToString(obj[key]);
        } else
        // TODO: Bug. Метод isArray() не доступен в прототипе.
        if ((obj[key].isArray && obj[key].isArray()) || obj[key].constructor === Array) {
            item += ArrayToString(obj[key]);
        } else
        if (checkType(obj[key])) {
            if (checkType(obj[key], String)) {
                item += "\"" + obj[key] + "\"";
            } else {
                item += obj[key];
            }
        } else
        if (checkType(obj[key], Object) || checkType(obj[key], Array)) {
            item += JSON.stringify(obj[key]);
        }
        result.push(item);item = "";
    }
    return start + result.join(',') + end;
}

function ArrayToString (obj) {
    var start = "[", end = "]",
        result = [], item = "";
    for (var key in obj) {
        if (!obj.has(key) || key === 'length') continue;
        if (obj[key].isObject && obj[key].isObject()) {
            item += ObjectToString(obj[key]);
        } else
        if (obj[key].isArray && obj[key].isArray()) {
            item += ArrayToString(obj[key]);
        } else
        if (checkType(obj[key])) {
            item += obj[key];
        } else
        if (checkType(obj[key], Object) || checkType(obj[key], Array)) {
            item += JSON.stringify(obj[key]);
        }
        result.push(item);item = "";
    }
    return start + result.join(',') + end;
}
