

function current_seconds() {
    var d = new Date();
    var sec = d.getSeconds();
    console.log(sec);
    setTimeout(current_seconds, 1000);
}

current_seconds();