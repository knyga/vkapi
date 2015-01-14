# vkapi
Clientside api on javascript for vk.com that depends on requirejs, underscore, jquery

```javascript
options = _.extend({
    reset: false,
    action: 'audio.get',
    data: {},
    callback: function(response) {
        if(_.isUndefined(response.response.items)) {
            this.set(response.response);
        } else {
            this.set(response.response.items);
        }

        if(options.reset) {
            this.trigger('reset', this, options);
        }
    }
}, options);

vkapi.exec(options, this);
```
