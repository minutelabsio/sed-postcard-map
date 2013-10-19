define(
    [
        'jquery',
        'stapes',
        'backbone',
        'lodash',
        'google/maps',
        'vex',
        'vex.dialog',
        'modules/simple-carousel'
    ],
    function(
        $,
        Stapes,
        Backbone,
        _,
        google,
        vex,
        dialog,
        SimpleCarousel
    ) {

        'use strict';

        vex.defaultOptions.className = 'vex-theme-default';
        dialog.defaultOptions.showCloseButton = true;

        var collection = new (Backbone.Collection.extend({
            model: Backbone.Model.extend({
                // urlRoot: '/data?id=',
            }),
            url: '/data'
        }));

        /**
         * Page-level Mediator
         * @module Boilerplate
         * @implements {Stapes}
         */
        var Mediator = Stapes.subclass({

            /**
             * Mediator Constructor
             * @return {void}
             */
            constructor : function(){

                var self = this;
                self.initEvents();

                self.postcardChooser = SimpleCarousel();
                collection.fetch( {reset: true} );

                $(function(){
                    self.emit('domready');
                });
            },

            /**
             * Initialize events
             * @return {void}
             */
            initEvents : function(){

                var self = this;
                self.on('domready',self.onDomReady);

                self.on({

                    'change:city': function( place ){

                        var sel = self.get('selected')
                            ,loc
                            ;

                        if ( !place ){
                            return;
                        }

                        loc = place.geometry.location;

                        if (self.map){
                            self.map.setCenter( loc );
                            if ( place.geometry.viewport ){
                                self.map.fitBounds( place.geometry.viewport );
                            } else {
                                self.map.setZoom( 10 );
                            }
                        }

                        if (!sel){
                            return;
                        }

                        var model = collection.get( sel );
                        model.save({
                            lat: loc.lat(),
                            lng: loc.lng(),
                            title: place.name
                        }, {
                            success: function(){

                                self.msg('Location set for image "'+sel+'"');
                            }, 
                            error: function(){
                                self.msg('Problem communicating with server');
                            }
                        });
                    }
                });

                collection.on('reset', function(){
                    var images = _.indexBy(collection.map(function( item ){
                        return {
                            id: item.id,
                            img: 'library/images/postcards/' + item.id
                        };
                    }), 'id');

                    self.postcardChooser.set( images );
                });
            },

            msg: function( text ){

                var self = this;
                $('<div class="msg">').text( text ).appendTo('#messages').delay(5000).fadeOut(2000, function(){
                    $(this).remove();
                });
            },

            /**
             * DomReady Callback
             * @return {void}
             */
            onDomReady : function(){

                var self = this;

                self.el = $('#wrap-map');

                var myOptions = {
                    center: new google.maps.LatLng(30, 0),
                    zoom: 2,
                    minZoom: 2,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                
                var map = self.map = new google.maps.Map(self.el[0], myOptions);

                // init search box
                var $search = $('<input id="search">');
                
                var autocomplete = new google.maps.places.Autocomplete( $search[0], {
                        types: ['(cities)'],
                        bounds: new google.maps.LatLngBounds(
                            new google.maps.LatLng(-90, -180),
                            new google.maps.LatLng(90, 180)
                        )
                    })
                    ;

                map.controls[google.maps.ControlPosition.TOP_CENTER].push( $search[0] );

                google.maps.event.addListener(autocomplete, 'place_changed', function() {

                    var place = autocomplete.getPlace();

                    if (!place.geometry){

                        place = null;
                    }
                    
                    self.set('city', place);
                });

                // init picture chooser
                map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push( self.postcardChooser.render().$el[0] );

                self.postcardChooser.on('click', function( id ){
                    self.postcardChooser.$el.find('.item').removeClass('on');
                    var el = self.postcardChooser.$el.find('[data-id="'+id+'"]');
                    el.addClass('on');

                    var model = collection.get( id );
                    if (model.get('lat')){
                        self.msg(id + ': '+JSON.stringify(model.toJSON()));
                    } else {
                        self.msg(id + ': (no data)');
                    }

                    self.set('selected', id);
                    self.set('city', false);

                    $search.val('').focus();
                });
            }

        });

        return new Mediator();

    }

);

