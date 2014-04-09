module.exports = function(a, func, thisp) {
    if (a != null) {
        (a.forEach ? a : [a]).forEach(func, thisp);
    }
};