!function(exports,global){"use strict";function Morphine(){return this.bubbler=function(){},MorphineBuilder.apply(MorphineCreator(this.bubbler),arguments)}function MorphineArray(){return this.bubbler=function(){},MorphineArrayCreator(this.bubbler)}function MorphineCreator(bubbler){var f=function(){},proto=new M(bubbler);return f.prototype=proto,f.prototype.constructor=Morphine,new f}function MorphineArrayCreator(bubbler){var f=function(){},proto=new MA(bubbler);return f.prototype=proto,f.prototype.constructor=MorphineArray,new f}function M(){var parent=this,myKey=null;return this.__subscribes={add:[],remove:[],change:[],all:[]},this.bubbleHandler=function(event){var k=this.getMyKey();null===event.path&&(event.path=event.fieldName),k&&(event.path=k+CONFIG.separator+event.path),parent.emit(event.type,event),parent.parentBubbleHandler(event)},this.parentBubbleHandler=function(){},this.setParentBubbleHandler=function(parentBubbleHandler){parent.parentBubbleHandler=parentBubbleHandler},this.setMyKey=function(key){myKey=key},this.getMyKey=function(){return myKey},this}function MA(){var parent=this,myKey=null;return this.__subscribes={add:[],remove:[],change:[],all:[]},this.bubbleHandler=function(event){var k=this.getMyKey();null===event.path&&(event.path=event.fieldName),k&&(event.path=k+CONFIG.separator+event.path),parent.emit(event.type,event),parent.parentBubbleHandler(event)},this.parentBubbleHandler=function(){},this.setParentBubbleHandler=function(parentBubbleHandler){parent.parentBubbleHandler=parentBubbleHandler},this.setMyKey=function(key){myKey=key},this.getMyKey=function(){return myKey},this}function Event(eventType,relativePath,fieldName){return this.type=eventType,this.relativePath=relativePath,this.path=null,this.fieldName=fieldName,this}function EventCreator(eventType,relativePath,fieldName){return new Event(eventType,relativePath,fieldName)}function EventEmitter(eventType,relativePath,fieldName){this.emit(eventType,EventCreator(eventType,relativePath,fieldName)),this.emit("all",EventCreator(eventType,relativePath,fieldName)),this.emitBubble(EventCreator(eventType,relativePath,fieldName))}function MorphineBuilder(){var ln=arguments.length;switch(ln){case 1:checkType(arguments[0],String)?setter.apply(this,arguments):(checkType(arguments[0],Object)||checkType(arguments[0],Array))&&converter.call(this,arguments[0],!0);break;case 2:setter.apply(this,arguments)}return this}function Configure(options){checkType(options,Object)&&(this.separator=options.separator?options.separator:this.separator)}function checkType(real,expect){expect=expect?[expect]:[Boolean,String,Number];var ln=expect.length;if("undefined"==typeof real||null===real)return ln>1?!0:!1;for(var i=0;ln>i;i++)if(expect[i]===real||expect[i]===real.constructor)return!0;return!1}function builder(path,value,self){function innerBuilder(pathArray,value){var index=pathArray.shift(),testInt=intRegexp.test(pathArray[0]),testCollection="$"===pathArray[0],eventType="",isChange=!1;return currentLevel.push(index),0===pathArray.length?void("$"===index?value&&(this.push(isMorphine(value)?newObjectPrepare.call(this,value,this.length.toString()):value),EventEmitter.call(this,"add",path,index)):intRegexp.test(index)?this.has(index)&&"undefined"==typeof this[index]?(this[index]=isMorphine(value)?newObjectPrepare.call(this,value,index):value,EventEmitter.call(this,"change",path,index)):this.has(index)||(this.push(isMorphine(value)?newObjectPrepare.call(this,value,this.length.toString()):value),EventEmitter.call(this,"add",path,index),this.length-1!=index&&console.error("Несоответствие индекса созданного элемента ожидаемому индексу")):(eventType="undefined"!=typeof this[index]?"change":"add",this[index]=isMorphine(value)?newObjectPrepare.call(this,value,index):value,EventEmitter.call(this,eventType,path,index))):(testInt||testCollection?testCollection?"$"===index?(this.push(newObjectPrepare.call(this,new MorphineArray,this.length.toString())),EventEmitter.call(this,"add",currentLevel.join(CONFIG.separator),index)):(isChange="undefined"!=typeof this[index],eventType=isChange?"change":"add",isChange?this[index]=this[index]:(this[index]=newObjectPrepare.call(this,new MorphineArray,index),EventEmitter.call(this,eventType,currentLevel.join(CONFIG.separator),index))):testInt&&(intRegexp.test(index)||"$"===index)?(this.push(newObjectPrepare.call(this,new MorphineArray,this.length.toString())),EventEmitter.call(this,"add",currentLevel.join(CONFIG.separator),index)):(isChange="undefined"!=typeof this[index],eventType=isChange?"change":"add",isChange?this[index]=this[index]:(this[index]=newObjectPrepare.call(this,new MorphineArray,index),EventEmitter.call(this,eventType,currentLevel.join(CONFIG.separator),index))):intRegexp.test(index)?(isChange="undefined"!=typeof this[index],eventType=isChange?"change":"add",isChange?this[index]=this[index]:(this[index]=newObjectPrepare.call(this,new Morphine,index),EventEmitter.call(this,eventType,currentLevel.join(CONFIG.separator),index))):"$"===index?(this.push(newObjectPrepare.call(this,new Morphine,this.length.toString())),EventEmitter.call(this,"add",currentLevel.join(CONFIG.separator),index)):(isChange="undefined"!=typeof this[index],eventType=isChange?"change":"add",isChange?this[index]=this[index]:(this[index]=newObjectPrepare.call(this,new Morphine,index),EventEmitter.call(this,eventType,currentLevel.join(CONFIG.separator),index))),"$"===index&&(index=this.length-1),void innerBuilder.call(this[index],pathArray,value))}var pathArray=path.split(CONFIG.separator),currentLevel=[],morph=this;self?innerBuilder.call(morph,pathArray,value):innerBuilder.call(this,pathArray,value)}function newObjectPrepare(obj,key){return obj.setParentBubbleHandler(this.bubbleHandler),obj.setMyKey(key),obj}function isMorphine(obj){return checkType(obj,Morphine)||checkType(obj,MorphineArray)?!0:!1}function getter(pathArray,source){var index=pathArray.shift();return pathArray.length?getter(pathArray,source[index]):source[index]}function setter(path,value){var valToSet=value,checkResult=checkType(valToSet),mObject=null;return checkResult||(checkType(valToSet,Object)?mObject=new Morphine:checkType(valToSet,Array)?mObject=new MorphineArray:(checkType(valToSet,Morphine)||checkType(valToSet,MorphineArray))&&(checkResult=!0)),builder.bind(this)(path,checkResult?valToSet:converter.bind(mObject)(valToSet)),this}function converter(obj,self){function toMorphine(obj,construct){var morph=construct?new construct:this;for(var key in obj)obj.hasOwnProperty(key)&&(!obj.hasOwnProperty(key)||"undefined"!=typeof obj[key]&&null!==obj[key]?checkType(obj[key],Object)?valueSetter.call(morph,key,toMorphine.call(morph,obj[key],Morphine)):checkType(obj[key],Array)?valueSetter.call(morph,key,toMorphine.call(morph,obj[key],MorphineArray)):checkType(obj[key])?valueSetter.call(morph,key,obj[key]):console.error("Конструктор не определен %o %o %o",obj,key,obj[key]):valueSetter.call(morph,key,obj[key]));return morph}function valueSetter(key,value){this.isObject()?this.set(key,value):this.isArray()&&this.push(value)}return checkType(obj,Array)?toMorphine.call(this,obj,self?null:MorphineArray):checkType(obj,Object)?toMorphine.call(this,obj,self?null:Morphine):obj}function merger(src){var dst=this;for(var key in src)src.has(key)&&(src.has(key)&&(src.isUndefined(key)||src.isNull(key))?dst[key]=src[key]:checkType(src[key].constructor)?dst[key]=src[key]:(dst.has(key)||(src[key].isArray()?dst[key]=new MorphineArray:src[key].isObject()&&(dst[key]=new Morphine)),merger.call(dst[key],src[key])));return dst}function stringifier(){function ObjectToString(){var obj=this,start="{",end="}",result=[],item="";for(var key in obj)obj.has(key)&&(item+='"'+key+'":',obj[key].isObject&&obj[key].isObject()?item+=ObjectToString.call(obj[key]):obj[key].isArray&&obj[key].isArray()||obj[key].constructor===Array?item+=ArrayToString.call(obj[key]):checkType(obj[key])?item+=checkType(obj[key],String)?'"'+obj[key]+'"':obj[key]:(checkType(obj[key],Object)||checkType(obj[key],Array))&&(item+=JSON.stringify(obj[key])),result.push(item),item="");return start+result.join(",")+end}function ArrayToString(){for(var obj=this,start="[",end="]",result=[],item="",ln=obj.length,key=0;ln>key;key++)obj.has(key)&&"length"!==key&&(obj[key].isObject&&obj[key].isObject()?item+=ObjectToString.call(obj[key]):obj[key].isArray&&obj[key].isArray()?item+=ArrayToString.call(obj[key]):checkType(obj[key])?item+=obj[key]:(checkType(obj[key],Object)||checkType(obj[key],Array))&&(item+=JSON.stringify(obj[key])),result.push(item),item="");return start+result.join(",")+end}var currentString="";return this.isObject()?currentString=ObjectToString.call(this):this.isArray()&&(currentString=ArrayToString.call(this)),currentString}function PathGenerator(){function pathBuilder(prev_path,path_list){var valueByPath,pathObject,item=this,path="";if(!checkType(item))for(var key in item)item.has(key)&&"length"!==key&&(item.isObject&&item.isObject()||item.isArray&&item.isArray())&&(path=prev_path+(prev_path.length&&prev_path.length>0?".":"")+key,valueByPath=item[key],pathObject={},pathObject.path=path,checkType(valueByPath)&&(pathObject.value=valueByPath),path_list.push(pathObject),pathBuilder.call(item[key],path,path_list))}var paths=[];return pathBuilder.call(this,"",paths),paths}function Clear(){for(var key in this)this.hasOwnProperty(key)&&delete this[key]}function BuildFromPath(paths){this.clear();for(var key in paths)paths.hasOwnProperty(key)&&(intRegexp.test(paths[key].path.split(CONFIG.separator).pop())||builder.call(this,paths[key].path,paths[key].value,!0))}function replaceGlobal(){return global.Morphine=Morphine,Morphine}function shareApi(){return global.MorphineShareApi=exports,null}global.Morphine=exports;var CONFIG={separator:".",bubbleEvent:!0},intRegexp=/^[0-9]*$/;Morphine.prototype.version="0.0.9",MA.prototype=new Array,MA.prototype=new MA,MA.prototype.constructor=MA;var CommonPrototypeMixin={isObject:function(){return this.constructor===Morphine},isArray:function(){return this.constructor===MorphineArray},isNull:function(key){return null===this[key]},isUndefined:function(key){return"undefined"==typeof this[key]},isEmpty:function(){for(var key in this)if(this.has(key))return!1;return!0},has:function(path){if(path.constructor===Number)return this.hasOwnProperty(path);var pathArray=path.split(CONFIG.separator);if(1===pathArray.length)return this.hasOwnProperty(path);var lastItem=pathArray.pop(),checkObject=getter(pathArray,this);return checkObject.hasOwnProperty&&checkObject.hasOwnProperty(lastItem)},merge:function(src){return src.isObject||src.isArray?merger.call(this,src):merger.call(this,converter.call(this,src)),this},set:function(path,value){return setter.call(this,path,value,!0),this},get:function(path){var pathArray=path.split(CONFIG.separator);return getter(pathArray,this)},config:function(){return Configure.apply(this,arguments),this},stringify:function(){return stringifier.call(this)},plain:function(){return JSON.parse(this.stringify())},toPaths:function(){return PathGenerator.call(this)},remove:function(path){var pathArray=path.split(CONFIG.separator),target=pathArray.pop();if(pathArray.length>0)var morph=getter(pathArray,this);else var morph=this;return morph.isArray()&&intRegexp.test(target)?morph.splice(target,1):delete morph[target],this.emit.call(morph,"remove",EventCreator("remove",path,target)),this.emit.call(morph,"all",EventCreator("remove",path,target)),this.emitBubble.call(morph,EventCreator("remove",path,target)),this},clear:function(){return Clear.call(this),this},buildFromPaths:function(paths){BuildFromPath.call(this,paths)}},EventsPrototypeMixin={on:function(eventType,subfunc){this.__subscribes[eventType].push(subfunc)}};M.prototype.emit=MA.prototype.emit=function(eventType,event){for(var listeners=this.__subscribes[eventType],ln=listeners?listeners.length:0,i=0;ln>i;i++)listeners[i].call({},event)},M.prototype.emitBubble=MA.prototype.emitBubble=function(event){this.parentBubbleHandler&&this.parentBubbleHandler(event)},M.mixin=MA.mixin=function(){for(var ln=arguments.length,i=0;ln>i;i++)if(checkType(arguments[i],Object))for(var prop in arguments[i])arguments[i].hasOwnProperty(prop)&&(this.prototype[prop]=arguments[i][prop])},M.mixin(CommonPrototypeMixin,EventsPrototypeMixin,CONFIG),MA.mixin(CommonPrototypeMixin,EventsPrototypeMixin,CONFIG),exports.Morphine=replaceGlobal(),exports.MorphineShareApi=shareApi()}({},function(){return this}());