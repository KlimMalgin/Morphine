

function PathGenerator () {
    var paths = [];
    if (this.isObject()) {
        ObjectPathGenerator(this, "");
    } else
    if (this.isArray()) {
        ArrayPathGenerator(this, "");
    }
    return paths;
}

function ObjectPathGenerator (item, prev_path) {
    var path = "";
    if (checkType(item)) {
        // TODO: Значения и простые типы не добавляем
    } else
    if (item.isEmpty()) {
        // TODO: Не ясно что добавлять в path
    } else {
        for (var key in item) {
            if (item.isObject && item.isObject()) {
                path = ObjectPathGenerator(item[key], prev_path + "." + key);
            } else
            if (item.isArray && item.isArray()) {
                path = ArrayPathGenerator(item[key], prev_path + "." + key);
            }
        }
    }
    return path;
}

function ArrayPathGenerator (item, prev_path) {
    var path = "";
    if (checkType(item)) {
        // TODO: Значения и простые типы не добавляем
    } else
    if (item.isEmpty()) {
        // TODO: Не ясно что добавлять в path
    } else {
        for (var key in item) {
            if (item.isObject && item.isObject()) {
                path = ObjectPathGenerator(item[key], prev_path + "." + key);
            } else
            if (item.isArray && item.isArray()) {
                path = ArrayPathGenerator(item[key], prev_path + "." + key);
            }
        }
    }
    return path;
}