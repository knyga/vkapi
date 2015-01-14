define(['jquery', 'underscore'], function($, _) {

    var VKAPI = {};
    VKAPI.url = 'https://api.vk.com/method';
    VKAPI.version = '5.27';
    VKAPI.token = '';

    VKAPI._listeners = {};
    VKAPI._scopes = {};
    VKAPI.on = function(name, fnc, scope) {
        if(!_.isArray(this._listeners[name])) {
            this._listeners[name] = [];
            this._scopes[name] = [];
        }

        this._listeners[name].push(fnc);
        this._scopes[name].push(scope);
    };
    VKAPI.trigger = function(name) {
        if(_.isArray(this._listeners[name])) {
            var args = arguments.splice(1);
            for(var i=0; i<this._listeners[name].length; i++) {
                var fnc = this._listeners[name][i],
                    scope = this._scopes[name][i];

                fnc.apply(scope, args);
            }
        }
    };

    VKAPI.fetch = function(ioptions, scope) {
        if(_.isUndefined(scope)) {
            scope = this;
        }

        var options = _.extend({}, {
            callback: _.noop,
            data: {},
            action: '',
            urlBase: VKAPI.url,
            version: VKAPI.version,
            token: VKAPI.token
        });

        $.ajax({
            url: options.urlBase+options.action,
            jsonp: 'callback',
            data: _.extend(options.data, {
                v: options.version,
                access_token: options.token
            }),
            dataType: 'jsonp',
            success: function(response) {
                if(!_.isEmpty(response.error)) {
                    VKAPI.trigger('error', response.error);
                    return;
                }

                options.callback.apply(scope);
            }
        });
    }
});