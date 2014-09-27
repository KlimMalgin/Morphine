/**
 * Created by KlimMalgin on 26.09.2014.
 */
'use strict';


/**
 * http://habrahabr.ru/post/224825/
 **/

/***
 * @constructor
 */
function MorphineArray() { /*this.constructor = MorphineArray;*/ }
MorphineArray.prototype = new Array();
MorphineArray.prototype = new MorphineArray();
MorphineArray.prototype.constructor = MorphineArray;

/***
 * @constructor
 */
function Morphine(obj) {
    if (obj) {
        this.build(obj);
    }
}

module.exports = Morphine;
