var slice = [].slice; 

/**
 * Extends an object with the properties of another object.
 *
 * @param  {Object} target The target object to extend (optional, if not provided an empty object is used as the target)
 * @param  {Object} source The source object with properties
 * @return {Object} The extended object
 */
function extend(target, source) { //A simple function to copy properties from one project to another
    if (!target) { //Check if a target was provided, otherwise create a new empty object to return
        target = {};
    }
    for (var propName in source) {
        if (source.hasOwnProperty(propName)) { //Only look at source properties that are not inherited
            target[propName] = source[propName]; //Copy the property
        }
    }

    return target;
}

/**
 * Invokes a provided callback for each name/value pair
 * in a JavaScript object.
 *
 * <p>
 * <h2>Usage</h2>
 * <js>
 * raptor.forEachEntry(
 *     {
 *         firstName: "John",
 *         lastName: "Doe"
 *     },
 *     function(name, value) {
 *         console.log(name + '=' + value);
 *     },
 *     this);
 * )
 * // Output:
 * // firstName=John
 * // lastName=Doe
 * </js>
 * @param  {Object} o A JavaScript object that contains properties to iterate over
 * @param  {Function} fun The callback function for each property
 * @param  {Object} thisp The "this" object to use for the callback function
 * @return {void}
 */
function forEachEntry(o, fun, thisp) {
    for (var k in o)
    {
        if (o.hasOwnProperty(k))
        {
            fun.call(thisp, k, o[k]);
        }
    }
}

function forEach(a, func, thisp) {
    if (a != null) {
        (a.forEach ? a : [a]).forEach(func, thisp);
    }
}

function _inherit(clazz, superclass, copyProps) { //Helper function to setup the prototype chain of a class to inherit from another class's prototype
    
    var proto = clazz.prototype;
    var F = function() {};
    
    F.prototype = superclass.prototype;

    clazz.prototype = new F();
    clazz.$super = superclass;

    if (copyProps !== false) {
        extend(clazz.prototype, proto);
    }

    clazz.prototype.constructor = clazz;
    return clazz;
}


function inherit(clazz, superclass) {
    return _inherit(clazz, superclass, true);
}

function inherits(clazz, superclass) {
    return _inherit(clazz, superclass, false);
}

function makeClass(clazz) {
    var superclass;

    if (typeof clazz === 'function') {
        superclass = clazz.$super;
    }
    else {
        var o = clazz;
        clazz = o.$init || function() {};
        superclass = o.$super;

        delete o.$super;
        delete o.$init;

        clazz.prototype = o;
    }
    
    if (superclass) {
        inherit(clazz, superclass);
    }

    var proto = clazz.prototype;
    proto.constructor = clazz;
    
    return clazz;
}

function createError(message, cause) {
    var error,
        argsLen = arguments.length,
        E = Error;
    
    if (argsLen == 2) {
        error = message instanceof E ? message : new E(message);
        if (error.stack) {
            error.stack += '\nCaused by: ' + (cause.stack || cause);
        }
        else {
            error._cause = cause;    
        }
    }
    else if (argsLen == 1) {
        if (message instanceof E)
        {
            error = message;
        }
        else
        {
            error = new E(message);
        }
    }
    
    return error;
}

function arrayFromArguments(args, startIndex) {
    if (!args) {
        return [];
    }
    
    if (startIndex) {
        return startIndex < args.length ? slice.call(args, startIndex) : [];
    }
    else
    {
        return slice.call(args);
    }
}

function makeEnum(enumValues, Ctor) {
    if (Ctor) {
        Ctor = makeClass(Ctor);
    } else {
        Ctor = function () {};
    }

    var proto = Ctor.prototype;
    var count = 0;

    function _addEnumValue(name, EnumCtor) {
        var ordinal = count++;
        return extend(Ctor[name] = new EnumCtor(), {
            ordinal: ordinal,
            compareTo: function(other) {
                return ordinal - other.ordinal;
            },
            name: name
        });
    }

    function EnumCtor() {}

    if (Array.isArray(enumValues)) {
        enumValues.forEach(function (name) {
            _addEnumValue(name, Ctor);
        });
    } else if (enumValues) {
        EnumCtor.prototype = proto;
        forEachEntry(enumValues, function (name, args) {
            Ctor.apply(_addEnumValue(name, EnumCtor), args || []);
        });
    }

    Ctor.valueOf = function (name) {
        return Ctor[name];
    };


    if (proto.toString == Object.prototype.toString) {
        proto.toString = function() {
            return this.name;
        };
    }

    return Ctor;
}

function tryRequire(id, require) {
    var path;
    
    try {
        path = require.resolve(id);
    }
    catch(e) {}

    if (path) {
        return require(path);
    }
}

module.exports = {
    tryRequire: tryRequire,
    inherit: inherit,
    inherits: inherits,
    makeClass: makeClass,
    makeEnum: makeEnum,
    extend: extend,
    forEachEntry: forEachEntry,
    forEach: forEach,
    createError: createError,
    arrayFromArguments: arrayFromArguments
};
