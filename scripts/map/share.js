  /**
   *  Share view
   *
   *  Example:
   *
   *  var zoom = new slavery.ui.view.Share({
   *    el: $('.share')
   *  });
   */


  slavery.ui.view.Share = cdb.core.View.extend({

    initialize: function() {
      // this.template = cdb.templates.getTemplate('chart/views/nav.jst.js');

      this.template = new cdb.core.Template({
        template: template = $("#share-template").html()
      });

      this.render();

      this._initBindings();
    },

    _initBindings: function() {
      this.$el.find('.share.facebook').on('click', null, this, this._shareOnFacebook);
      this.$el.find('.share.twitter').on('click', null, this, this._shareOnTwitter);
    },

    _shareOnTwitter: function(e) {
      var self = e.data;

      var url = encodeURIComponent(window.location.href),
          text = encodeURIComponent(window.document.title),
          windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
          width = 550,
          height = 420;

      $(e.target).attr('href', "https://twitter.com/share?url=" + url + "&text=" + text);

      window.open(e.target.href, 'intent', windowOptions + ',width=' + width + ',height=' + height);

      e.preventDefault && e.preventDefault();
    },

    _shareOnFacebook: function(e) {
      e.preventDefault();

      var self = e.data;

      var url = encodeURIComponent(window.location.href),
          text = encodeURIComponent(window.document.title),
          windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
          width = 550,
          height = 321;

      $(e.target).attr('href', "http://www.facebook.com/sharer.php?u=" + url + "&text=" + text);

      window.open(e.target.href, 'facebookPopup', windowOptions + ',width=' + width + ',height=' + height);

      e.preventDefault && e.preventDefault();
    },

    // _generateShortUrl: function(url, callback) {
    //   $.ajax({
    //     url:"https://api-ssl.bitly.com/v3/shorten?longUrl=" + encodeURIComponent(url)+ "&login=" + this.options.bitly.login + "&apiKey=" + this.options.bitly.key,
    //     type:"GET",
    //     async: false,
    //     dataType: 'jsonp',
    //     success: function(r) {
    //       if (!r.data.url) {
    //         callback && callback(url);
    //         throw new Error('BITLY doesn\'t allow localhost alone as domain, use localhost.lan for example');
    //       } else {
    //         callback && callback(r.data.url)
    //       }
    //     },
    //     error: function(e) { callback && callback(url) }
    //   });
    // },

    render: function() {
      this.$el.append(this.template.render());
      return this;
    }
  });
