
function PathGenerator () {
    var paths = [];
    if (this.isObject()) {
        ObjectPathGenerator(this, "", paths);
    } else
    if (this.isArray()) {
        ArrayPathGenerator(this, "", paths);
    }
    return paths;
}

// TODO: Методы ObjectPathGenerator и ArrayPathGenerator идентичны. Нужно их реорганизовать
function ObjectPathGenerator (item, prev_path, path_list) {
    var path = "";
    if (checkType(item)) {
        // TODO: Значения и простые типы не добавляем
    } else
    if (item.isEmpty()) {
        // TODO: Не ясно что добавлять в path
    } else {
        for (var key in item) {
            // TODO: Проверка key === "length" - это костыль. Нужно избавиться от свойства length в массиве
            if (!item.has(key) || key === "length") continue;
            if (item.isObject && item.isObject()) {
                // TODO: Повторяющаяся проверка. Нужно от нее избавиться
                path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                path_list.push(path);
                ObjectPathGenerator(item[key], path, path_list);
            } else
            if (item.isArray && item.isArray()) {
                // TODO: Повторяющаяся проверка. Нужно от нее избавиться
                path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                path_list.push(path);
                ArrayPathGenerator(item[key], path, path_list);
            }
        }
    }
}

function ArrayPathGenerator (item, prev_path, path_list) {
    var path = "";
    if (checkType(item)) {
        // TODO: Значения и простые типы не добавляем
    } else
    if (item.isEmpty()) {
        // TODO: Не ясно что добавлять в path
    } else {
        for (var key in item) {
            // TODO: Проверка key === "length" - это костыль. Нужно избавиться от свойства length в массиве
            if (!item.has(key) || key === "length") continue;
            if (item.isObject && item.isObject()) {
                // TODO: Повторяющаяся проверка. Нужно от нее избавиться
                path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                path_list.push(path);
                path = ObjectPathGenerator(item[key], path, path_list);
            } else
            if (item.isArray && item.isArray()) {
                // TODO: Повторяющаяся проверка. Нужно от нее избавиться
                path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                path_list.push(path);
                path = ArrayPathGenerator(item[key], path, path_list);
            }
        }
    }
}
