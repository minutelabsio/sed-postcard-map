define(
    [
        'plugins/async!http://maps.googleapis.com/maps/api/js?key=AIzaSyAfvKdYJEDOZaDFxxDhFgEGU46tSnQbFDQ&sensor=false&libraries=places'//,drawing,geometry'
    ],
    function(
        
    ){

        return window.google;
    }
);