define(
    [
        'jquery',
        'stapes',
        'google/maps',
        'marker-clusterer',
        'vex',
        'vex.dialog',
        'tpl!templates/postcard-info-window.tpl',
        'json!data/postcards.json'
    ],
    function(
        $,
        Stapes,
        google,
        MarkerClusterer,
        vex,
        dialog,
        tplPostcardInfoWindow,
        postcards
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
                
                var markers = [];
                
                $.each(postcards, function(i, entry){
                    
                    var info
                        ,div = tplPostcardInfoWindow.render( entry )
                        ;
                    
                    var m = new google.maps.Marker({
                        // title: entry.city,
                        position: new google.maps.LatLng(entry.lat, entry.lng),
                        map: map,
                        icon: 'library/images/mail_24x18.png'
                    });
                    
                    markers.push(m);
                    
                    google.maps.event.addListener(m, 'click', function(){

                        dialog.open({
                            message: false,
                            input: div,
                            buttons: [
                                $.extend({}, dialog.buttons.YES, { text: 'Close' })
                            ],
                            callback: $.noop
                        });
                    });
                });
                
                var markerCluster = new MarkerClusterer(map, markers, {
                    zoomOnClick: true,
                    gridSize: 20,
                    styles: [{
                        url: 'library/images/mail_24x18.png',
                        height: 18,
                        width: 24,
                        textSize: 13,
                        textColor: '#eee'
                    }]
                });
            }

        });

        return new Mediator();

    }

);




