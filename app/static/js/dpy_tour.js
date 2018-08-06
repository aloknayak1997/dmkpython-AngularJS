(function() {

  var createDelayedClick = function (selector) {
      var wrapper = function () {
          return function (sel) {
              $(sel).click();
          }(selector);
      };

      return function () {
          setTimeout(wrapper, 10);
      }
  };

  var init, setupShepherd;

  init = function() {
    return setupShepherd();
  };

  setupShepherd = function() {
    var shepherd;
    shepherd = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
        showCancelLink: true
      }
    });

    var step1 = shepherd.addStep('step1_id', {
      title:'Access profile and settings',
      text: 'Setup your profile and settings.',
      attachTo: '.my-settings left',
      classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
      buttons: [
        {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });

    console.log(shepherd);
    // if ( step1.isOpen() ) {
    //   console.log('hide 1');
    //   // $('.dashboard-settings').trigger('click');
    //   createDelayedClick('.dashboard-settings');
    // }

    var step2 = shepherd.addStep('step2_id', {
      title:'Setup your profile',
      text: 'Update your personal and Institute details here.',
      attachTo: '.my-profile left',
      classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
      buttons: [
        {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });

    return shepherd.start();
    
  };


  $(init);

}).call(this);