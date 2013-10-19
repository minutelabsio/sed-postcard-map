/**
 * Config options at: http://requirejs.org/docs/api.html#config
 */
require.config({

    config: {
        // module specific configuration
    },
    
    shim: {
        'marker-clusterer': {
            deps: ['google/maps'],
            exports: 'MarkerClusterer'
        },

        'backbone': {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        }
    },

    paths: {
        //
        //  This is where you can add paths to any plugins or vendor scripts.
        //

        // Plugins
        'text': 'plugins/text',
        'json': 'plugins/json',
        'tpl' : 'plugins/tpl',
        'async' : 'plugins/async',

        // Templating
        'dot' : 'vendor/doT',

        // MVC
        'stapes': 'vendor/stapes',
        
        // jQuery
        'jquery': 'vendor/jquery',

        'backbone': 'vendor/backbone',

        'lodash': 'vendor/lodash',

        // marker clusterer
        'marker-clusterer': 'vendor/marker-clusterer',

        // dialogs
        'vex': 'vendor/vex',
        'vex.dialog': 'vendor/vex.dialog'
    },

    map: {
        
        '*' : {
            'google/maps': 'modules/adapters/google-maps',
            // 'jquery': 'modules/adapters/jquery', // jQuery noconflict adapter
            'site-config': 'config/site-config.json'
        },

        // 'modules/adapters/jquery': {
        //     'jquery': 'jquery'
        // },

        'backbone': {
            'underscore': 'lodash'
        }
    }
});
