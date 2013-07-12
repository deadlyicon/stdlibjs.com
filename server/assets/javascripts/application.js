//= require jquery
//= require bootstrap
//= require jasmine
//= require jasmine-html
//= require_self

context = describe;

function assert(outcome, message) {
  expect(outcome).toBe(true)
}

!function(){
  function currentBuild(){
    return location.search.slice(1);
  }

  function selectedBuild(){
    return $('form').serialize().replace('=&','&');
  }

  function startJasmine(){
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    jasmineEnv.htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(jasmineEnv.htmlReporter);

    jasmineEnv.specFilter = function(spec) {
      return jasmineEnv.htmlReporter.specFilter(spec);
    };

    jasmineEnv.execute();
  }

  function adjustFormButtons(){
    if (!selectedBuild()){
      $('.btn.build, .btn.download, .btn.rebuild').addClass('hidden');
    }else if (!currentBuild()){
      $('.btn.build').removeClass('hidden');
      $('.btn.download, .btn.rebuild').addClass('hidden');
    }else if (currentBuild() === selectedBuild()){
      $('.btn.download').removeClass('hidden');
      $('.btn.build, .btn.rebuild').addClass('hidden');
    }else{
      $('.btn.rebuild').removeClass('hidden');
      $('.btn.build, .btn.download').addClass('hidden');
    }
  }

  $(adjustFormButtons);

  $(window).on('load',function() {
    if (currentBuild()) startJasmine();
  });

  $(document).on('change', 'form :checkbox', adjustFormButtons);

  $(document).on('submit', 'form', function(event){
    event.preventDefault();
    window.location = '/?'+selectedBuild();
  });

  $(document).on('click', '.check-all', function(event){
    event.preventDefault();
    $('form :checkbox').prop('checked', true);
    adjustFormButtons()
  });

  $(document).on('click', '.uncheck-all', function(event){
    event.preventDefault();
    $('form :checkbox').prop('checked', false);
    adjustFormButtons()
  });

}();
