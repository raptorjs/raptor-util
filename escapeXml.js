var elTest = /[&<]/;
var elTestReplace = /[&<]/g;
var attrTest = /[&<>\"\'\n]/;
var attrReplace = /[&<>\"\'\n]/g;
var replacements = {
    '<': "&lt;",
    '>': "&gt;",
    '&': "&amp;",
    '"': "&quot;",
    "'": "&#39;",
    '\n': "&#10;" //Preserve new lines so that they don't get normalized as space
};

function escapeXml(str) {
    if (typeof str === 'string' && elTest.test(str)) {
        return str.replace(elTestReplace, function(match) {
            return replacements[match];
        });
    }
    return str;
}

function escapeXmlAttr(str) {
    if (typeof str === 'string' && attrTest.test(str)) {
        return str.replace(attrReplace, function(match) {
            return replacements[match];
        });
    }
    return str;
}


module.exports = escapeXml;
escapeXml.attr = escapeXmlAttr;