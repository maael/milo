module.exports = function(grunt) {
	var bundles = getBundles();

	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
		        	reporter: 'spec'
		        },
		        src: 'test/**/*.js'
			}
		},
		mocha: {
			test: {
				src: 'test_html/**/*.html',
				options: {
					run: true,
					log: true,
					reporter: 'Spec'
				}
			}
		},
		browserify: {
			milo: {
				files: {
					'milo.bundle.js': 'lib/milo.js'
				}
			},
			test1: {
				options: {
					debug: true
				}, 
				files: {
					'test_html/bind_test.bundle.js': 'test_html/bind_test/*.js'
				}
			}
		},
		watch: {
			milo: {
				files: ['lib/**/*.js', 'node_modules/proto/lib/proto.js'],
				tasks: 'browserify:milo'
			},
			test1: {
				files: [
					'lib/**/*.js', 
					'node_modules/proto/lib/proto.js', 
					'test_html/bind_test/*.js'
				],
				tasks: 'browserify:test1'
			}
		}
		// concat: {
		// 	options: {
		// 		separator: ';',
		// 	},
		// 	dist: {
		// 		src: ['lib/bndr.js'],
		// 		dest: 'bndr.js'
		// 	}
		// },
		// uglify: {
		// 	build: {
		// 		src: 'bndr.js',
		// 		dest: 'bndr.js'
		// 	}
		// },

	});

	//grunt.loadNpmTasks('grunt-contrib-concat');
	//grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha');

	grunt.registerTask('test', 'mochaTest');
	grunt.registerTask('htmltest', ['browserify:test1', 'watch']);
	grunt.registerTask('default', ['test', 'browserify', 'watch']);

	function getBundles() {
        return {
        };
    }
};