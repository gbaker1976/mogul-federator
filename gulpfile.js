var gulp = require( 'gulp' );
var aglio = require( 'gulp-aglio' );

gulp.task( 'gen-api-docs', function() {
	return gulp.src( './doc/**/*.md' )
	.pipe( aglio( { template: 'default' } ) )
	.pipe( gulp.dest( './doc' ) );
});

gulp.watch( './doc/**/*.md', { cwd: 'doc' }, [ 'gen-api-docs' ] );

gulp.task( 'default', [ 'gen-api-docs' ] );
