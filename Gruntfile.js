module.exports = function(grunt) {
	var bundles = getBundles();

	grunt.initConfig({
		concat: {
			options: {
				separator: '\n\n',
			},
			dist: {
				src: bundles.docs,
				dest: 'docs/milo.js'
			}
		},
		docco: {
			build: {
				src: ['docs/milo.js'],
				options: {
					output: 'docs/'
				}
			}
		},
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
				},
				options: {
					transform: ['brfs']
				}
			},
			test1: {
				options: {
					debug: true
				}, 
				files: {
					'test_html/bind_test.bundle.js': 'test_html/bind_test/*.js'
				}
			},
			tests: {
				files: [{
                    expand: true,
                    src: 'test_browser/**/*.js',
                    dest: '.tmp-test-browser'
                }]
			}
		},
		watch: {
			milo: {
				files: ['lib/**/*.js', 'node_modules/mol-proto/lib/proto.js'],
				tasks: 'browserify:milo'
			},
			test1: {
				files: [
					'lib/**/*.js', 
					'node_modules/mol-proto/lib/proto.js', 
					'test_html/bind_test/*.js'
				],
				tasks: 'browserify:test1'
			},
			tests: {
				files: [
					'lib/**/*.js',
					'node_modules/mol-proto/lib/proto.js', 
					'test_browser/**/*.js'
				],
				tasks: 'browserify:tests'
			}
		}
		// uglify: {
		// 	build: {
		// 		src: 'bndr.js',
		// 		dest: 'bndr.js'
		// 	}
		// },

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	//grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-docco');

	grunt.registerTask('test', 'mochaTest');
	grunt.registerTask('docs', ['concat', 'docco']);
	grunt.registerTask('htmltest', ['browserify:test1', 'watch']);
	grunt.registerTask('default', ['test', 'browserify', 'watch']);
	grunt.registerTask('skiptest', ['browserify', 'watch']);

	function getBundles() {
        return {
        	docs: [
        		//These could be broken up into seperate pages
        		'lib/milo.js',

        		'lib/loader.js',
        		'lib/binder.js',
				'lib/classes.js',
				'lib/config.js',
				'lib/minder.js',

				'lib/mail/index.js',

				'lib/util/index.js',
				'lib/util/logger.js',
				'lib/util/logger_class.js',
				'lib/util/count.js',
				'lib/util/dom.js',
				'lib/util/error.js',
				'lib/util/check.js',
				'lib/util/request.js',

				'lib/facets/f_class.js',
				'lib/facets/f_object.js',

				'lib/components/c_facets/cf_registry.js',
				'lib/components/c_facets/Container.js',
				'lib/components/c_facets/Data.js',
				'lib/components/c_facets/Dom.js',
				'lib/components/c_facets/Drag.js',
				'lib/components/c_facets/Drop.js',
				'lib/components/c_facets/Editable.js',
				'lib/components/c_facets/Events.js',
				'lib/components/c_facets/Frame.js',
				'lib/components/c_facets/Item.js',
				'lib/components/c_facets/List.js',
				'lib/components/c_facets/ModelFacet.js',
				'lib/components/c_facets/Split.js',
				'lib/components/c_facets/Template.js',

				'lib/components/c_class.js',
				'lib/components/c_facet.js',
				'lib/components/c_info.js',
				'lib/components/c_registry.js',
				'lib/components/scope.js',

				'lib/components/c_message_sources/component_data_source.js',
				'lib/components/c_message_sources/dom_events_source.js',
				'lib/components/c_message_sources/dom_events_constructors.js',
				'lib/components/c_message_sources/editable_events_source.js',
				'lib/components/c_message_sources/iframe_message_source.js',

				'lib/model/index.js',
				'lib/model/connector.js',
				'lib/model/demo.js',
				'lib/model/path_utils.js',

				'lib/messenger/index.js',
				'lib/messenger/message_source.js',
				'lib/messenger/message.js',

				'lib/attribute/index.js',
				'lib/attribute/a_bind.js',
				'lib/attribute/a_load.js',

				'lib/abstract/mixin.js',
				'lib/abstract/registry.js'
        	]
        };
    }
};