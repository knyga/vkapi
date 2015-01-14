define(['jquery', 'underscore'], function($, _) {

    if(!window.VKAPI) {
        var VKAPI = {};
        VKAPI.attributes = {};
        VKAPI.defaults = {
            url: 'https://api.vk.com/method/',
            version: '5.27',
            token: ''
        };

        VKAPI.get = function(name) {
            var value = this.attributes[name];

            if(_.isUndefined(value)) {
                value = this.defaults[name];
            }

            return value;
        };

        VKAPI.set = function(name, value) {
            this.attributes[name] = value;
        };

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

        VKAPI.exec = function(ioptions, scope) {
            if(_.isUndefined(scope)) {
                scope = this;
            }

            var options = _.extend({}, {
                callback: _.noop,
                data: {},
                action: '',
                urlBase: VKAPI.get('url'),
                version: VKAPI.get('version'),
                token: VKAPI.get('token')
            }, ioptions);

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

                    options.callback.call(scope, response);
                }
            });
        }

        window.VKAPI = VKAPI;
    }

    return window.VKAPI;
});