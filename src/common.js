exports.init = function() {
    Array.prototype.contains = function (fun) {
        if (this === undefined || this.length === 0)
            return false;

        for (var i = 0; i < this.length; i++) {
            if (fun(this[i])) return true;
        }

        return false;
    };


    Array.prototype.first = function (fun) {
        if (this === undefined || this.length === 0)
            return null;

        for (var i = 0; i < this.length; i++) {
            if (fun(this[i])) return this[i];
        }

        return null;
    };


    Array.prototype.where = function (fun) {
        if (this === undefined || this.length === 0)
            return null;

        var results = [];
        for (var i = 0; i < this.length; i++) {
            if (fun(this[i])) 
                results.push(this[i]);
        }

        return results;
    };

    Array.prototype.find = function (fun) {
        if (this === undefined || this.length === 0)
            return null;

        for (var i = 0; i < this.length; i++) {
            if (fun(this[i])) 
                return i;
        }

        return null;
    };
}