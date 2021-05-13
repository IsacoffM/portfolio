'use strict';

(() => {
  angular.module('app')
  .component('people', {
    templateUrl: 'people/people.html',
    controller: PeopleController,
    controllerAs: 'vm'
  });
  
  PeopleController.$inject = [];

  function PeopleController() {
    const vm = this;

  }
})();
