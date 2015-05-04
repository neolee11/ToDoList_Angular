var gulp = require('gulp');

gulp.task('vet', function(){
    console.log('hello world');
});


//////////////
function log(msg){
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                gulpUtil.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}



