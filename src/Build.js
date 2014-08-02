

/**
 * @private
 * Метод выстроит объект по структуре указанной в path
 * @param {String} path Задает структуру объекта для построения
 * @param {Any} value Значение последнего элемента в path
 **/
function BuildObject (path, value) {
    var props = path.split('.'),
        iter = this, base = iter,
        intRegexp = /^[0-9]$/;

    for (var i = 0; i < props.length; i++) {
        if (typeof iter === 'undefined') break;

        if (i == (props.length-1)) {
            if (props[i] === '$') {
                iter.push(value);
            } else if (intRegexp.test(props[i])) {
                if (typeof iter[props[i]] === 'undefined') {
                    console.error("Элемент %o не существует", props.slice(0, i+1).join('.'));
                }
            } else {
                iter[props[i]] = value;
            }
        } else {
            if (intRegexp.test(props[i+1]) || props[i+1] === '$') {
                // Если следующий элемент - число или текущий обозначен как коллекция, то на текущем уровне нужно создать массив
                if (props[i] === '$') {
                    iter.push(new MorphineArray());
                } else if (intRegexp.test(props[i])) {
                    if (typeof iter[props[i]] === 'undefined') {
                        console.error("Элемент %o не существует", props.slice(0, i+1).join('.'));
                    } else {
                        // TODO: Если элемент существует ничего не делаем, т.к. нужно продолжить работу с текущим элементом
                    }
                } else {
                    iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new MorphineArray();
                }
            } else {
                if (intRegexp.test(props[i])) {
                    /*if (typeof iter[props[i]] === 'undefined') {
                        // TODO: Неустоявшееся поведение: Если элемент еще не существует - ничего с ним не делаем, т.к. не ясно что с ним делать
                        console.info("TODO: Неустоявшееся поведение: Если элемент еще не существует - ничего с ним не делаем, т.к. не ясно что с ним делать");
                    } else {
                        // TODO: Resolve Неустоявшееся поведение: Если элемент уже существует - ничего с ним не делаем, т.к. нужно продолжить работу с существующим элементом
                        console.info("TODO: Resolve Неустоявшееся поведение: Если элемент уже существует - ничего с ним не делаем, т.к. нужно продолжить работу с существующим элементом");
                    }*/
                    iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new Morphine();
                } else if (props[i] === '$') {
                    iter.push(new Morphine());
                } else {
                    iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new Morphine();
                }
            }

            if (props[i] === '$') {
                iter = iter[iter.length-1];
            } else {
                iter = iter[props[i]];
            }
        }
    }
    return base;
}
