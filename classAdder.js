function classAdder(entity, classes) {
    var keys, i;
    if (typeof classes == "string") {
        classes = classes.split(" ");
    }
    keys = Object.keys(classes);
    var keysCount = keys.length;
    for (i = 0; i < keysCount; i++) {
        entity.classList.add(classes[keys[i]]);
    }
}