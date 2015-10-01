(function (window) {

    var NAVEEGO_LOG_URL = window.naveegoLogging.loggingUrl,
        NAVEEGO_REPO = window.naveegoLogging.repository,
        NAVEEGO_SOURCE = window.naveegoLogging.source,
        NAVEEGO_LOG_CONSOLE = window.naveegoLogging.sendConsoleErrors || false;

    function NaveegoLogger(options) {
        this.options = options || {};
        if (!this.options.logUrl) this.options.logUrl = NAVEEGO_LOG_URL;
        if (!this.options.repository) this.options.repository = NAVEEGO_REPO;
        if (!this.options.source) this.options.source = NAVEEGO_SOURCE;

        this.loggingUrl = this.options.logUrl + '/' + this.options.repository + '/' + this.options.source + '/pixel.png';
    }



    NaveegoLogger.prototype = {

        log: function (data) {
            if (!data || (typeof (data) === 'Object' || typeof (data) === 'string')) {
                return;
            }

            if (typeof (data) == 'string') {
                data = {
                    "message": data
                };
            }

            try {
                var img = new Image(),
                    d = "d=" + encodeURIComponent(JSON.stringify(data));
                img.src = this.loggingUrl + '?_t=' + new Date().getTime() + '&' + d;
            } catch (er) {
                if (window && window.console && typeof window.console.log === 'function') {
                    console.log("Could not sent log to Naveego:\n" + ex);
                    console.log("Failed Data:", data);
                }
            }
        }

    };

    if (NAVEEGO_LOG_CONSOLE) {
        var _error = window.onerror;
        window.onerror = function (errorMsg, url, line) {
            var logger = new NaveegoLogger();
            logger.log({
                "message": errorMsg,
                "level": "ERROR",
                "url": url
            });
            _error.apply(window, arguments);
        }
    }


    if (typeof (define) === 'function' && define.amd) {
        define('naveego-logger', function () {
            return NaveegoLogger;
        });
    }

    window.NaveegoLogger = NaveegoLogger;

})(window);