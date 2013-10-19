define(
    [
        'jquery',
        'stapes'
    ],
    function(
        $,
        Stapes
    ) {

        'use strict';

        /**
         * Simple Carousel
         * @module Boilerplate
         * @implements {Stapes}
         */
        var SimpleCarousel = Stapes.subclass({

            /**
             * SimpleCarousel Constructor
             * @return {void}
             */
            constructor : function(){

                var self = this;

                self.$el = $('<div class="simple-carousel" tabindex="1">');

                self.initEvents();
            },

            /**
             * Initialize events
             * @return {void}
             */
            initEvents : function(){

                var self = this;

                self.on('create', function( id ){
                    var img = self.get( id ).img;
                    self.addImage( id, img );
                });

                self.$el.on('click', '.item', function(){
                    var id = $(this).attr('data-id');
                    self.emit( 'click', id );
                    self.emit( 'click:'+id, self.get( id ) );
                    return false;
                });
            },

            addImage: function( id, src ){

                var self = this;
                self.$el.append('<img src="'+src+'" class="item" data-id="'+id+'">');
                return this;
            },

            render: function(){

                var self = this
                    ,html = ''
                    ,data = self.getAll()
                    ,src
                    ;

                for ( var id in data ){
                    src = data[ id ];
                    html += '<img src="'+src+'" class="item" data-id="'+id+'">'
                }

                self.$el.html( html );

                return this;
            }

        });

        return function(){
            return new SimpleCarousel();
        };
    }
);