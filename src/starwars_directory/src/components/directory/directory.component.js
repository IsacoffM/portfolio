'use strict';

(() => {
  angular.module('app')
  .component('directory', {
    templateUrl: 'directory/directory.html',
    controller: DirectoryController,
    controllerAs: 'vm'
  });

  DirectoryController.$inject = [];

  function DirectoryController() {
    const vm = this;

  }
})();
