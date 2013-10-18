define(
    [
        'jquery',
        'stapes',
        'google/maps',
        'vex',
        'vex.dialog',
        'modules/simple-carousel'
    ],
    function(
        $,
        Stapes,
        google,
        vex,
        dialog,
        SimpleCarousel
    ) {

        'use strict';

        vex.defaultOptions.className = 'vex-theme-default';
        dialog.defaultOptions.showCloseButton = true;

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

                        var sel = self.get('selected');

                        if ( !place ){
                            return;
                        }

                        if (self.map){
                            self.map.setCenter( place.geometry.location );
                            if ( place.geometry.viewport ){
                                self.map.fitBounds( place.geometry.viewport );
                            } else {
                                self.map.setZoom( 10 );
                            }
                        }

                        if (!sel){
                            return;
                        }

                        self.msg('Location set for image "'+sel+'"');
                    }
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
                var postcardChooser = SimpleCarousel();
                map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push( postcardChooser.render().$el[0] );
                postcardChooser.push( (new Array(100)).join(',library/images/postcards/test.jpg').split(',') );

                postcardChooser.on('click', function( id ){
                    postcardChooser.$el.find('.item').removeClass('on');
                    var el = postcardChooser.$el.find('[data-id="'+id+'"]');
                    el.addClass('on');

                    self.set('selected', id);
                    self.set('city', false);

                    $search.val('').focus();
                });
            }

        });

        return new Mediator();

    }

);

